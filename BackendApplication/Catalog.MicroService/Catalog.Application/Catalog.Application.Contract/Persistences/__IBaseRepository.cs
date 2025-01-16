using Microsoft.EntityFrameworkCore.Storage;
using System.Linq.Expressions;

namespace Catalog.Application.Contract.Persistence;

/// <summary>
/// Interface for the base repository providing common data access methods.
/// </summary>
/// <typeparam name="TEntity">The type of the entity.</typeparam>
public partial interface IBaseRepository<TEntity> where TEntity : IBaseEntity
{
    /// <summary>
    /// Begins a new database transaction.
    /// </summary>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The database transaction.</returns>
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets the count of entities matching the specified expression.
    /// </summary>
    /// <param name="expression">The expression to filter entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The count of entities.</returns>
    Task<long> GetCountAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets a single entity matching the specified expression.
    /// </summary>
    /// <param name="expression">The expression to filter entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The entity if found; otherwise, null.</returns>
    Task<TEntity?> GetSingleAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets a single entity matching the specified expression, including related entities.
    /// </summary>
    /// <param name="expression">The expression to filter entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <param name="includeExpressions">The expressions to include related entities.</param>
    /// <returns>The entity if found; otherwise, null.</returns>
    Task<TEntity?> GetSingleAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default!, params Expression<Func<TEntity, object>>[] includeExpressions);

    /// <summary>
    /// Gets a list of entities without tracking changes.
    /// </summary>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A collection of entities.</returns>
    Task<ICollection<TEntity>> GetListAsNoTrackingAsync(CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets a paginated list of entities without tracking changes.
    /// </summary>
    /// <param name="page">The page number.</param>
    /// <param name="pageSize">The page size.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A collection of entities.</returns>
    Task<ICollection<TEntity>> GetListAsNoTrackingAsync(int page = 1, int pageSize = 100, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a list of entities matching the specified expression without tracking changes, including related entities.
    /// </summary>
    /// <param name="expression">The expression to filter entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <param name="includeExpressions">The expressions to include related entities.</param>
    /// <returns>A collection of entities.</returns>
    Task<ICollection<TEntity>> GetListAsNoTrackingAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default, params Expression<Func<TEntity, object>>[] includeExpressions);

    /// <summary>
    /// Gets a paginated list of entities matching the specified expression without tracking changes, including related entities.
    /// </summary>
    /// <param name="expression">The expression to filter entities.</param>
    /// <param name="page">The page number.</param>
    /// <param name="pageSize">The page size.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <param name="includeExpressions">The expressions to include related entities.</param>
    /// <returns>A collection of entities.</returns>
    Task<ICollection<TEntity>> GetListAsNoTrackingAsync(Expression<Func<TEntity, bool>> expression, int page = 1, int pageSize = 100, CancellationToken cancellationToken = default, params Expression<Func<TEntity, object>>[] includeExpressions);

    /// <summary>
    /// Creates a new entity.
    /// </summary>
    /// <param name="entity">The entity to create.</param>
    void Create(TEntity entity);

    /// <summary>
    /// Updates an existing entity.
    /// </summary>
    /// <param name="entity">The entity to update.</param>
    void Update(TEntity entity);

    /// <summary>
    /// Deletes an existing entity.
    /// </summary>
    /// <param name="entity">The entity to delete.</param>
    void Delete(TEntity entity);

    /// <summary>
    /// Deletes a range of entities.
    /// </summary>
    /// <param name="entities">The entities to delete.</param>
    void DeleteRange(params TEntity[] entities);

    /// <summary>
    /// Saves changes asynchronously.
    /// </summary>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task SaveChangesAsync(CancellationToken cancellationToken = default!);
}