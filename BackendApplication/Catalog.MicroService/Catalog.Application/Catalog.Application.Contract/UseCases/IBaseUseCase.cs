namespace Catalog.Application.Contract.UseCase;

public partial interface IBaseUseCase<TEntity> where TEntity : class, IBaseEntity
{
    Task<TEntity[]> GetListAsync(int page = 1, int pageSize = 100, CancellationToken cancellationToken = default!);
    Task<TEntity?> GetByIdAsync(long Id, CancellationToken cancellationToken = default!);
}
