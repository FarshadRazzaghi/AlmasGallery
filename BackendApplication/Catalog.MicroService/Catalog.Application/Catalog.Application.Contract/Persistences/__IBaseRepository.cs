using Microsoft.EntityFrameworkCore.Storage;
using System.Linq.Expressions;

namespace AlmasGallery.Catalog.Application.Contract.Persistence;

/// <summary>
/// Interface for the base repository providing common data access methods.
/// </summary>
/// <typeparam name="TEntity">The type of the entity.</typeparam>
public partial interface IBaseRepository<TEntity> where TEntity : IBaseEntity
{
    /// <summary>
    /// Begins a new database transaction.
    /// </summary>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the database transaction.</returns>
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default!);

    /// <summary>
    /// Retrieves an <see cref="IQueryable{TEntity}"/> for the entity set with optional filtering,
    /// configured for no-tracking queries. Use this method when you want to read data without 
    /// tracking changes, which can improve performance for read-only operations.
    /// </summary>
    /// <param name="expression">An optional filter expression to restrict the entities returned.</param>
    /// <returns>An <see cref="IQueryable{TEntity}"/> representing the filtered query with no tracking enabled.</returns>
    IQueryable<TEntity> GetQueryableAsNoTracking(Expression<Func<TEntity, bool>>? expression = null);

    /// <summary>
    /// Retrieves an <see cref="IQueryable{TEntity}"/> for the entity set with optional filtering,
    /// with default tracking behavior enabled. Use this method when you intend to update or 
    /// manipulate the returned entities within the current DbContext scope.
    /// </summary>
    /// <param name="expression">An optional filter expression to restrict the entities returned.</param>
    /// <returns>An <see cref="IQueryable{TEntity}"/> representing the filtered query with tracking enabled.</returns>
    IQueryable<TEntity> GetQueryable(Expression<Func<TEntity, bool>>? expression = null);

    /// <summary>
    /// Gets the count of entities matching the specified expression.
    /// </summary>
    /// <param name="expression">The expression to filter entities.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the count of entities.</returns>
    Task<long> GetCountAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets a single entity matching the specified expression.
    /// </summary>
    /// <param name="expression">The expression to filter entities.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the entity if found; otherwise, null.</returns>
    Task<TEntity?> GetSingleAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets a single entity matching the specified expression, including related entities.
    /// </summary>
    /// <param name="expression">The expression to filter entities.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <param name="includeExpressions">The expressions to include related entities.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the entity if found; otherwise, null.</returns>
    Task<TEntity?> GetSingleAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default!, params Expression<Func<TEntity, object>>[] includeExpressions);

    /// <summary>
    /// Gets a list of entities without tracking changes.
    /// </summary>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a collection of entities.</returns>
    Task<ICollection<TEntity>> GetListAsNoTrackingAsync(CancellationToken cancellationToken = default!);

    /// <summary>
    /// Gets a paginated list of entities without tracking changes.
    /// </summary>
    /// <param name="page">The page number to retrieve. Defaults to 1.</param>
    /// <param name="pageSize">The number of items per page. Defaults to 100.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a collection of entities.</returns>
    Task<ICollection<TEntity>> GetListAsNoTrackingAsync(int page = 1, int pageSize = 100, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a list of entities matching the specified expression without tracking changes, including related entities.
    /// </summary>
    /// <param name="expression">The expression to filter entities.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <param name="includeExpressions">The expressions to include related entities.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a collection of entities.</returns>
    Task<ICollection<TEntity>> GetListAsNoTrackingAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default, params Expression<Func<TEntity, object>>[] includeExpressions);

    /// <summary>
    /// Gets a paginated list of entities matching the specified expression without tracking changes, including related entities.
    /// </summary>
    /// <param name="expression">The expression to filter entities.</param>
    /// <param name="page">The page number to retrieve. Defaults to 1.</param>
    /// <param name="pageSize">The number of items per page. Defaults to 100.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <param name="includeExpressions">The expressions to include related entities.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a collection of entities.</returns>
    Task<ICollection<TEntity>> GetListAsNoTrackingAsync(Expression<Func<TEntity, bool>> expression, int page = 1, int pageSize = 100, CancellationToken cancellationToken = default, params Expression<Func<TEntity, object>>[] includeExpressions);

    /// <summary>
    /// Creates a new entity.
    /// </summary>
    /// <param name="entity">The entity to create.</param>
    void Add(TEntity entity);

    /// <summary>
    /// Updates an existing entity.
    /// </summary>
    /// <param name="entity">The entity to update.</param>
    void Modify(TEntity entity);

    /// <summary>
    /// Deletes an existing entity.
    /// </summary>
    /// <param name="entity">The entity to delete.</param>
    void Remove(TEntity entity);

    /// <summary>
    /// Deletes a range of entities.
    /// </summary>
    /// <param name="entities">The entities to delete.</param>
    void DeleteRange(params TEntity[] entities);

    /// <summary>
    /// Saves changes asynchronously.
    /// </summary>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task SaveChangesAsync(CancellationToken cancellationToken = default!);
}