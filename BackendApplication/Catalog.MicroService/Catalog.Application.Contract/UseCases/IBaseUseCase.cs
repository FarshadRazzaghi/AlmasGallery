using Catalog.Domain.Model;

namespace Catalog.Application.Contract.UseCase;

public partial interface IBaseUseCase<TEntity> where TEntity : BaseEntity
{
    Task<TEntity[]> GetListAsNoTrackingAsync(CancellationToken cancellationToken = default!);
}
