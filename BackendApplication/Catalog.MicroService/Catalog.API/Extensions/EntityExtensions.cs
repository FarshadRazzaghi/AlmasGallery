using Catalog.Application.Models.Responses;

namespace Catalog.API.Extensions;

public static class EntityExtensions
{
    public static CustomFieldGroupResponse[] AsObjectResult(this CustomFieldGroup[] result)
        => [.. result
              .Select(r => new CustomFieldGroupResponse
              {
                  Id = r.Id,
                  Name = r.Name,
                  EntityType = (Common.CustomFieldGroupEntityType)r.EntityType,
                  CustomFields = r.CustomFields.ToArray().AsObjectResult(),
              })];

    public static CustomFieldResponse[] AsObjectResult(this CustomField[] result)
        => [.. result
               .Select(cf => new CustomFieldResponse
               {
                    Name = cf.Name,
                    Id = cf.Id,
                    IsRequired = cf.IsRequired,
                    HelpText = cf.HelpText,
                    PlaceHolder = cf.PlaceHolder,
                    InitialValue = cf.InitialValue,
                    Validation = cf.Validation,
                    DataType = (Common.CustomFieldDataType)cf.DataType,
                    IsActive = cf.IsActive,
                    ParentId = cf.ParentId,
                    ParentCondition = cf.ParentCondition
               })];

    public static ProductCategoryResponse[] AsObjectResult(this ProductCategory[] result)
        => [.. result
               .Select(r => new ProductCategoryResponse
               {
                   Id = r.Id,
                   Name = r.Name,
                   Description = r.Description,
                   ParentId = r.ParentId,
                   CustomFieldGroups = r.ProductCategoryCustomFieldGroups.ToArray().AsObjectResult()
               })];

    public static ProductCategoryCustomFieldGroupResponse[] AsObjectResult(this ProductCategoryCustomFieldGroup[] result)
        => [.. result
              .Select(r => new ProductCategoryCustomFieldGroupResponse
              {
                  Id = r.CustomFieldGroupId,
                  IsActive = r.IsActive,
                  Name = r.CustomFieldGroup?.Name ?? string.Empty,
                  Location = (Common.CustomFieldGroupLocationType)r.CustomFieldGroupLocation,
                  EntityType = Common.CustomFieldGroupEntityType.Product,
                  CustomFields = (r.CustomFieldGroup?.CustomFields?.ToArray() ?? []).AsObjectResult(),
              })];

    public static DropdownResponse[] AsDropdownObjectResult(this CustomFieldGroup[] result)
        => [.. result.Select(r => new DropdownResponse { Value = r.Name, Key = r.Id })];

    public static DropdownResponse[] AsDropdownObjectResult(this ProductCategory[] result)
        => [.. result.Select(r => new DropdownResponse { Value = r.Name, Key = r.Id })];
}
