namespace Catalog.Application.Business.UseCase;

internal partial class BaseUseCase<TEntity>(IBaseRepository<TEntity> repository)
    : IBaseUseCase<TEntity> where TEntity : class, IBaseEntity
{
    public IBaseRepository<TEntity> Repository { get; } = repository;

    public async Task<TEntity[]> GetListAsync(CancellationToken cancellationToken = default)
        => [.. (await Repository.GetListAsNoTrackingAsync(cancellationToken))];

    public async Task<TEntity?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        if (id == 0)
        {
            return null;
        }

        var entity = await Repository.GetSingleAsync(x => x.Id == id, cancellationToken);
        return entity;
    }
}
