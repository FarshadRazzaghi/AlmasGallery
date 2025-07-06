namespace AlmasGallery.Catalog.Application.Contract.UseCase;

/// <summary>
/// Interface for the base use case providing common functionality for use cases.
/// </summary>
/// <typeparam name="TEntity">The type of the entity.</typeparam>
public partial interface IBaseUseCase<TEntity> where TEntity : class, IBaseEntity
{
    /// <summary>
    /// Gets a list of entities.
    /// </summary>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains an array of entities.</returns>
    Task<TEntity[]> GetListAsync(CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets a paginated list of entities.
    /// </summary>
    /// <param name="page">The page number to retrieve. Defaults to 1.</param>
    /// <param name="pageSize">The number of items per page. Defaults to 100.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains an array of entities.</returns>
    Task<TEntity[]> GetListAsync(int page = 1, int pageSize = 100, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets an entity by its unique identifier.
    /// </summary>
    /// <param name="Id">The unique identifier of the entity.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the entity if found; otherwise, null.</returns>
    Task<TEntity?> GetByIdAsync(long Id, CancellationToken cancellationToken = default!);
}
