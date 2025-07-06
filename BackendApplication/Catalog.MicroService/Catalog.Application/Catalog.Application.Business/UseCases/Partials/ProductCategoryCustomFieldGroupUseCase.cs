using System.Linq.Expressions;

namespace Catalog.Application.Business.UseCase;

internal partial class ProductCategoryCustomFieldGroupUseCase : IProductCategoryCustomFieldGroupUseCase
{
    /// <inheritdoc />
    public async Task<(ProductCategoryCustomFieldGroup[] list, long totalCount)> GetListAsync(long productCategoryId, bool activeOnly = false, CancellationToken cancellationToken = default)
    {
        Expression<Func<ProductCategoryCustomFieldGroup, bool>> filterExpression = x => x.ProductCategoryId == productCategoryId;
        if (activeOnly)
        {
            filterExpression = filterExpression.And(x => x.IsActive);
        }

        var totalCount = await Repository.GetCountAsync(expression: filterExpression, cancellationToken: cancellationToken);

        var list = await Repository.GetListAsNoTrackingAsync(expression: filterExpression,
                                                             includeExpressions: [x => x.CustomFieldGroup, x => x.CustomFieldGroup.CustomFields],
                                                             cancellationToken: cancellationToken);

        return (list.ToArray(), totalCount);
    }
}