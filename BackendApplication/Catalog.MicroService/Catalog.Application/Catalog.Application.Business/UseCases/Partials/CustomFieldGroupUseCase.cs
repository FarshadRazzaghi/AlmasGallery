using AlmasGallery.Catalog.Application.Models.Filters;
using AlmasGallery.Catalog.Application.Models.Requests;
using AlmasGallery.Catalog.Common;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Expressions;

namespace AlmasGallery.Catalog.Application.Business.UseCase;

/// <summary>
/// Implementation of the custom field group use case, providing methods to manage custom field groups.
/// </summary>
internal partial class CustomFieldGroupUseCase : ICustomFieldGroupUseCase
{
    /// <inheritdoc />
    public async Task<(CustomFieldGroup[] list, long totalCount)> GetListAsync(CustomFieldGroupFilter filter, CancellationToken cancellationToken = default)
    {
        Expression<Func<CustomFieldGroup, bool>> filterExpression = x => true;

        if (filter.GroupName != null && filter.GroupName.Length > 0)
        {
            filterExpression = filterExpression.And(x => filter.GroupName.Contains(x.Name));
        }

        if (filter.GroupType != null && filter.GroupType.Length > 0)
        {
            filterExpression = filterExpression.And(x => filter.GroupType.Contains((CustomFieldGroupEntityType)x.EntityType));
        }

        var totalCount = await Repository.GetCountAsync(expression: filterExpression, cancellationToken: cancellationToken);

        var list = await Repository.GetListAsNoTrackingAsync(expression: filterExpression,
                                                             page: filter.Page ?? 1,
                                                             pageSize: filter.PageSize ?? 100,
                                                             includeExpressions: (filter.IncludeCustomFields ?? true) ? [x => x.CustomFields] : [],
                                                             cancellationToken: cancellationToken);

        return (list.ToArray(), totalCount);
    }

    /// <inheritdoc />
    public async Task<CustomFieldGroup?> GetSingleIncludingCustomFieldsAsync(long customFieldGroupId, CancellationToken cancellationToken = default)
        => await Repository.GetSingleAsync(expression: x => x.Id == customFieldGroupId,
                                           includeExpressions: [x => x.CustomFields],
                                           cancellationToken: cancellationToken);

    /// <inheritdoc />
    public async Task<CustomFieldGroup> CreateAsync(CustomFieldGroupRequest customFieldGroupRequest, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(customFieldGroupRequest);
        ArgumentException.ThrowIfNullOrEmpty(customFieldGroupRequest.Name);

        using var trans = await UnitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            var duplicate = await Repository.GetSingleAsync(expression: x => x.Name == customFieldGroupRequest.Name && x.EntityType == (byte)customFieldGroupRequest.EntityType,
                                                           cancellationToken: cancellationToken);

            if (duplicate != null)
            {
                throw new DuplicateNameException("Another CustomFieldGroup with the same name and entity type already exists.");
            }

            var group = new CustomFieldGroup
            {
                Name = customFieldGroupRequest.Name,
                EntityType = (byte)customFieldGroupRequest.EntityType,
                Status = (byte)EntityStatus.Active,
                DateStamp = DateTime.UtcNow,
                CustomFields = []
            };

            var uniqueIdToIdMap = new Dictionary<Guid, long>();
            var fieldModels = new List<CustomField>();

            foreach (var dtoField in customFieldGroupRequest.CustomFields)
            {
                var field = new CustomField
                {
                    CustomFieldGroupId = group.Id,
                    Name = dtoField.Name,
                    DataType = (byte)dtoField.DataType,
                    InitialValue = dtoField.InitialValue,
                    PlaceHolder = dtoField.PlaceHolder,
                    HelpText = dtoField.HelpText,
                    IsActive = dtoField.IsActive,
                    IsRequired = dtoField.IsRequired,
                    Validation = dtoField.Validation,
                    DateStamp = DateTime.UtcNow,
                    Status = (byte)EntityStatus.Active,
                };

                group.CustomFields.Add(field);

                fieldModels.Add(field);
                uniqueIdToIdMap[dtoField.UniqueId] = 0;
            }

            Repository.Add(group);
            await UnitOfWork.SaveChangesAsync(cancellationToken);

            for (int i = 0; i < customFieldGroupRequest.CustomFields.Length; i++)
            {
                var dto = customFieldGroupRequest.CustomFields[i];
                var model = fieldModels[i];

                uniqueIdToIdMap[dto.UniqueId] = model.Id;
            }

            for (int i = 0; i < customFieldGroupRequest.CustomFields.Length; i++)
            {
                var dto = customFieldGroupRequest.CustomFields[i];
                var model = fieldModels[i];

                if (dto.ParentUniqueId.HasValue && uniqueIdToIdMap.TryGetValue(dto.ParentUniqueId.Value, out var pid))
                {
                    model.ParentCondition = dto.ParentCondition;
                    model.ParentId = pid;
                }
            }

            await UnitOfWork.SaveChangesAsync(cancellationToken);
            await trans.CommitAsync(cancellationToken);

            return group;
        }
        catch
        {
            await trans.RollbackAsync(cancellationToken);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task<CustomFieldGroup?> UpdateAsync(long customFieldId, CustomFieldGroupRequest customFieldGroupRequest, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(customFieldGroupRequest);
        ArgumentException.ThrowIfNullOrEmpty(customFieldGroupRequest.Name);

        using var trans = await UnitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            var existingGroup = await Repository.GetSingleAsync(expression: x => x.Id == customFieldId,
                                                                includeExpressions: [x => x.CustomFields],
                                                                cancellationToken: cancellationToken);

            if (existingGroup == null)
            {
                return null;
            }

            var duplicate = await Repository.GetSingleAsync(expression: x => x.Id != customFieldId && x.Name == customFieldGroupRequest.Name && x.EntityType == (byte)customFieldGroupRequest.EntityType,
                                                            cancellationToken: cancellationToken);

            if (duplicate != null)
            {
                throw new DuplicateNameException("Another CustomFieldGroup with the same name and entity type already exists.");
            }

            existingGroup.Name = customFieldGroupRequest.Name;
            existingGroup.EntityType = (byte)customFieldGroupRequest.EntityType;
            existingGroup.DateStamp = DateTime.UtcNow;

            var updatedFields = customFieldGroupRequest.CustomFields.ToList();
            var existingFields = existingGroup.CustomFields.ToList();

            var uniqueIdToIdMap = new Dictionary<Guid, long>();
            var fieldModels = new List<CustomField>();

            var fieldsToRemove = existingFields.Where(ef => !updatedFields.Any(uf => uf.Id == ef.Id)).ToList();
            var fieldsToRemoveIds = existingFields.Select(x => x.Id).ToList();
            var childrenToRemoveParent = existingGroup.CustomFields.Where(cf => fieldsToRemoveIds.Contains(cf.ParentId ?? 0)).ToList();

            if (childrenToRemoveParent.Count > 0)
            {
                foreach (var child in childrenToRemoveParent)
                {
                    child.ParentId = null;
                    UnitOfWork.CustomFieldRepository.Modify(child);
                }

                await UnitOfWork.SaveChangesAsync(cancellationToken);
            }

            foreach (var field in fieldsToRemove)
            {
                UnitOfWork.CustomFieldRepository.Remove(field);
                existingGroup.CustomFields.Remove(field);
            }

            foreach (var updatedField in updatedFields)
            {
                var existingField = existingFields.FirstOrDefault(f => f.Id == updatedField.Id && updatedField.Id != default);

                if (existingField == null)
                {
                    var newField = new CustomField
                    {
                        CustomFieldGroupId = existingGroup.Id,
                        Name = updatedField.Name,
                        DataType = (byte)updatedField.DataType,
                        InitialValue = updatedField.InitialValue,
                        PlaceHolder = updatedField.PlaceHolder,
                        HelpText = updatedField.HelpText,
                        IsActive = updatedField.IsActive,
                        IsRequired = updatedField.IsRequired,
                        Validation = updatedField.Validation,
                        DateStamp = DateTime.UtcNow,
                        Status = (byte)EntityStatus.Active,
                    };

                    UnitOfWork.CustomFieldRepository.Add(newField);
                    existingGroup.CustomFields.Add(newField);

                    fieldModels.Add(newField);
                }
                else
                {
                    existingField.Name = updatedField.Name;
                    existingField.DataType = (byte)updatedField.DataType;
                    existingField.InitialValue = updatedField.InitialValue;
                    existingField.PlaceHolder = updatedField.PlaceHolder;
                    existingField.HelpText = updatedField.HelpText;
                    existingField.IsActive = updatedField.IsActive;
                    existingField.IsRequired = updatedField.IsRequired;
                    existingField.Validation = updatedField.Validation;
                    existingField.ParentCondition = string.Empty;
                    existingField.DateStamp = DateTime.UtcNow;

                    UnitOfWork.CustomFieldRepository.Modify(existingField);

                    fieldModels.Add(existingField);
                }

                uniqueIdToIdMap[updatedField.UniqueId] = 0;
            }

            Repository.Modify(existingGroup);
            await UnitOfWork.SaveChangesAsync(cancellationToken);

            for (int i = 0; i < customFieldGroupRequest.CustomFields.Length; i++)
            {
                var dto = customFieldGroupRequest.CustomFields[i];
                var model = fieldModels[i];

                uniqueIdToIdMap[dto.UniqueId] = model.Id;
            }

            for (int i = 0; i < customFieldGroupRequest.CustomFields.Length; i++)
            {
                var dto = customFieldGroupRequest.CustomFields[i];
                var model = fieldModels[i];

                if (dto.ParentUniqueId.HasValue && uniqueIdToIdMap.TryGetValue(dto.ParentUniqueId.Value, out var pid))
                {
                    model.ParentCondition = dto.ParentCondition;
                    model.ParentId = pid;
                }
            }

            await UnitOfWork.SaveChangesAsync(cancellationToken);
            await trans.CommitAsync(cancellationToken);

            return existingGroup;
        }
        catch
        {
            await trans.RollbackAsync(cancellationToken);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task<bool> DeleteAsync(long customFieldGroupId, CancellationToken cancellationToken = default)
    {
        using var trans = await UnitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            var existingGroup = await Repository.GetSingleAsync(expression: x => x.Id == customFieldGroupId,
                                                                includeExpressions: [x => x.CustomFields],
                                                                cancellationToken: cancellationToken);

            if (existingGroup == null)
            {
                return false;
            }

            foreach (var field in existingGroup.CustomFields.ToList())
            {
                UnitOfWork.CustomFieldRepository.Remove(field);
            }

            Repository.Remove(existingGroup);

            await UnitOfWork.SaveChangesAsync(cancellationToken);
            await trans.CommitAsync(cancellationToken);

            return true;
        }
        catch
        {
            await trans.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
