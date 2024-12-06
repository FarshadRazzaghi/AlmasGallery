using Microsoft.EntityFrameworkCore.Storage;
using System.Linq.Expressions;

namespace Catalog.Application.Contract.Persistence;

public partial interface IBaseRepository<TEntity> where TEntity : IBaseEntity
{
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default!);
    Task<long> GetCountAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default!);
    Task<TEntity?> GetSingleAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default!);
    Task<TEntity?> GetSingleAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default!, params Expression<Func<TEntity, object>>[] includeExpressions);
    Task<ICollection<TEntity>> GetListAsNoTrackingAsync(CancellationToken cancellationToken = default!);
    Task<ICollection<TEntity>> GetListAsNoTrackingAsync(int page = 1, int pageSize = 100, CancellationToken cancellationToken = default);
    Task<ICollection<TEntity>> GetListAsNoTrackingAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default, params Expression<Func<TEntity, object>>[] includeExpressions);
    Task<ICollection<TEntity>> GetListAsNoTrackingAsync(Expression<Func<TEntity, bool>> expression, int page = 1, int pageSize = 100, CancellationToken cancellationToken = default, params Expression<Func<TEntity, object>>[] includeExpressions);
    void Create(TEntity entity);
    void Update(TEntity entity);
    void Delete(TEntity entity);
    void DeleteRange(params TEntity[] entities);
    Task SaveChangesAsync(CancellationToken cancellationToken = default!);
}