namespace Catalog.Application.Contract.UseCase;

/// <summary>
/// Interface for the base use case providing common functionality for use cases.
/// </summary>
/// <typeparam name="TEntity">The type of the entity.</typeparam>
public partial interface IBaseUseCase<TEntity> where TEntity : class, IBaseEntity
{
    /// <summary>
    /// Gets a list of entities.
    /// </summary>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>An array of entities.</returns>
    Task<TEntity[]> GetListAsync(CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets a paginated list of entities.
    /// </summary>
    /// <param name="page">The page number.</param>
    /// <param name="pageSize">The page size.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>An array of entities.</returns>
    Task<TEntity[]> GetListAsync(int page = 1, int pageSize = 100, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets an entity by ID.
    /// </summary>
    /// <param name="Id">The ID of the entity.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The entity if found; otherwise, null.</returns>
    Task<TEntity?> GetByIdAsync(long Id, CancellationToken cancellationToken = default!);
}
