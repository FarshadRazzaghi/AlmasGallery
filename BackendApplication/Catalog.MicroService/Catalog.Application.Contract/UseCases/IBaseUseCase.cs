using Catalog.Domain.Model;

namespace Catalog.Application.Contract.UseCase;

public partial interface IBaseUseCase<TEntity> where TEntity : class, IBaseEntity
{
    Task<TEntity[]> GetListAsync(CancellationToken cancellationToken = default!);
    Task<TEntity?> GetByIdAsync(long Id, CancellationToken cancellationToken = default!);
}
