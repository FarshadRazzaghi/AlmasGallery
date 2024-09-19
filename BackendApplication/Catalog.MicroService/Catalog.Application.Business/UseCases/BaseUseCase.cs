using Catalog.Application.Contract.Repository;
using Catalog.Application.Contract.UseCase;
using Catalog.Domain.Model;

namespace Catalog.Application.Business.UseCase;

internal partial class BaseUseCase<TEntity>(IBaseRepository<TEntity> repository)
    : IBaseUseCase<TEntity> where TEntity : BaseEntity
{
    public IBaseRepository<TEntity> Repository { get; } = repository;

    public async Task<TEntity[]> GetListAsNoTrackingAsync(CancellationToken cancellationToken = default)
        => [.. (await Repository.GetListAsNoTrackingAsync(cancellationToken))];
}
