namespace Catalog.Infrastructure.Repository;

internal partial class ProductRepository(AlmasGalleryContext contextManager)
    : BaseRepository<Product>(contextManager), IProductRepository
{
}