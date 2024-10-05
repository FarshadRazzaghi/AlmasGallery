namespace Catalog.Infrastructure.Repository;

internal partial interface IUnitOfWork
{
    void DiscardChanges();
    void SaveChanges();
    Task SaveChangesAsync();
}

internal partial interface IUnitOfWork
{
    IProductRepository ProductRepository { get; }
    IProductCategoryRepository ProductCategoryRepository { get; }
}
