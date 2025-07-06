namespace AlmasGallery.Catalog.Application.Contract.UseCase;

public partial interface IProductCategoryCustomFieldGroupUseCase
{
    Task<(ProductCategoryCustomFieldGroup[] list, long totalCount)> GetListAsync(long productCategoryId, bool activeOnly = false, CancellationToken cancellationToken = default);
}