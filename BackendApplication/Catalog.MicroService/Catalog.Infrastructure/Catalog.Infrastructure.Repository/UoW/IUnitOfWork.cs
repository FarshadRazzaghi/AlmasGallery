using Microsoft.EntityFrameworkCore.Storage;

namespace AlmasGallery.Catalog.Infrastructure.Repository;

/// <summary>
/// Interface for the Unit of Work pattern, providing methods to manage database transactions and changes.
/// </summary>
internal partial interface IUnitOfWork
{
    /// <summary>
    /// Gets the database context associated with the unit of work.
    /// </summary>
    AlmasGalleryDbContext? Context { get; }

    /// <summary>
    /// Begins a new database transaction asynchronously.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The started database transaction.</returns>
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default!);

    /// <summary>
    /// Commits the current database transaction asynchronously.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task CommitAsync(CancellationToken cancellationToken = default!);

    /// <summary>
    /// Rolls back the current database transaction asynchronously.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task RollbackAsync(CancellationToken cancellationToken = default!);

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
    Task SaveChangesAsync(CancellationToken cancellationToken = default!);
}