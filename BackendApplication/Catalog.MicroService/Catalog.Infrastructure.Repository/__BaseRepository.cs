using Catalog.Application.Contract.Repository;
using Catalog.Domain.Model;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure.Repository;

internal partial class BaseRepository<TEntity>(AlmasGalleryContext contextManager)
    : IBaseRepository<TEntity> where TEntity : BaseEntity
{
    #region Initialize
    private bool _disposed = false;
    protected AlmasGalleryContext Context { get; private set; } = contextManager ?? throw new ArgumentNullException(nameof(contextManager));
    protected DbSet<TEntity> DbSet => Context.Set<TEntity>();
    #endregion

    public async Task<List<TEntity>> GetListAsNoTrackingAsync(CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking().ToListAsync(cancellationToken);

    #region Save/Discard
    public virtual void DiscardChanges()
    {
        try
        {
            Context?.Dispose();
        }
        catch (Exception)
        {
            throw;
        }
    }

    public virtual void SaveChanges()
    {
        try
        {
            if (Context != null)
            {
                Context.SaveChanges();
                Dispose();
            }
        }
        catch (Exception)
        {
            throw;
        }
    }

    public virtual async Task SaveChangesAsync()
    {
        try
        {
            if (Context != null)
            {
                await Context.SaveChangesAsync();
                Dispose();
            }
        }
        catch (Exception)
        {
            throw;
        }
    }
    #endregion Save/Discard

    #region IDisposable
    public void Dispose()
    {
        Dispose(true);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (_disposed) return;
        _disposed = true;
    }
    #endregion IDisposable
}