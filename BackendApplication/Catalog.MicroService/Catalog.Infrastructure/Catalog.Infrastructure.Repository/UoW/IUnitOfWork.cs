namespace Catalog.Infrastructure.Repository;

internal partial interface IUnitOfWork
{
    AlmasGalleryContext? Context { get; }
    void DiscardChanges();
    void SaveChanges();
    Task SaveChangesAsync();
}