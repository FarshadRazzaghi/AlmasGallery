namespace Catalog.Infrastructure.Repository;

/// <summary>
/// Interface for the Unit of Work pattern, providing methods to manage database transactions and changes.
/// </summary>
internal partial interface IUnitOfWork
{
    /// <summary>
    /// Gets the database context associated with the unit of work.
    /// </summary>
    AlmasGalleryContext? Context { get; }

    /// <summary>
    /// Discards all changes made in the current database context.
    /// </summary>
    void DiscardChanges();

    /// <summary>
    /// Saves all changes made in the current database context to the database.
    /// </summary>
    void SaveChanges();

    /// <summary>
    /// Asynchronously saves all changes made in the current database context to the database.
    /// </summary>
    /// <returns>A task that represents the asynchronous save operation.</returns>
    Task SaveChangesAsync();
}