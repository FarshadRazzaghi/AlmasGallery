namespace Catalog.Infrastructure.Repository;

internal partial interface IUnitOfWork
{
    void DiscardChanges();
    void SaveChanges();
    Task SaveChangesAsync();
}