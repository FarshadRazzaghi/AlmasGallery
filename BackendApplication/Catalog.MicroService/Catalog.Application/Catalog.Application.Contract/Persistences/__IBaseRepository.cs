using System.Linq.Expressions;

namespace Catalog.Application.Contract.Persistence;

public partial interface IBaseRepository<TEntity> where TEntity : IBaseEntity
{
    Task<TEntity?> GetSingleAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default!);
    Task<ICollection<TEntity>> GetListAsNoTrackingAsync(CancellationToken cancellationToken = default!);
    void Create(TEntity entity);
    void Update(TEntity entity);
}