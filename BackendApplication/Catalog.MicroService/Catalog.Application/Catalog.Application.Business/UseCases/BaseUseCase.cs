using Catalog.Infrastructure.Repository;

namespace Catalog.Application.Business.UseCase;

/// <summary>
/// Base use case class providing common functionality for use cases.
/// </summary>
/// <typeparam name="TEntity">The type of the entity.</typeparam>
internal partial class BaseUseCase<TEntity>(IBaseRepository<TEntity> repository, IUnitOfWork unitOfWork)
    : IBaseUseCase<TEntity> where TEntity : class, IBaseEntity
{
    /// <summary>
    /// Gets the repository.
    /// </summary>
    public IBaseRepository<TEntity> Repository { get; } = repository;

    /// <summary>
    /// Gets the unit of work.
    /// </summary>
    public IUnitOfWork UnitOfWork { get; } = unitOfWork;

    public async Task<TEntity[]> GetListAsync(CancellationToken cancellationToken = default)
        => [.. (await Repository.GetListAsNoTrackingAsync(cancellationToken))];

    public async Task<TEntity[]> GetListAsync(int page = 1, int pageSize = 100, CancellationToken cancellationToken = default)
        => [.. (await Repository.GetListAsNoTrackingAsync(page, pageSize, cancellationToken))];

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
