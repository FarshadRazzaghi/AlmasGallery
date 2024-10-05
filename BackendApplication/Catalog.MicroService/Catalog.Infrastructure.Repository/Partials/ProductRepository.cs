namespace Catalog.Infrastructure.Repository;

internal partial class ProductRepository(AlmasGalleryContext contextManager)
    : BaseRepository<Product>(contextManager), IProductRepository
{
}

internal partial class ProductCategoryRepository(AlmasGalleryContext contextManager)
    : BaseRepository<ProductCategory>(contextManager), IProductCategoryRepository
{
}