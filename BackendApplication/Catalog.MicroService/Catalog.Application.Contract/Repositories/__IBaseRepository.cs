using Catalog.Domain.Model;

namespace Catalog.Application.Contract.Repository;

internal partial interface IBaseRepository<TEntity> where TEntity : BaseEntity
{
    Task<List<TEntity>> GetListAsNoTrackingAsync(CancellationToken cancellationToken = default!);
}
