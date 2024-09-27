using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Catalog.Infrastructure.Repository;

internal partial class BaseRepository<TEntity>(AlmasGalleryContext contextManager)
    : IBaseRepository<TEntity> where TEntity : class, IBaseEntity
{
    #region Initialize
    private bool _disposed = false;
    protected AlmasGalleryContext Context { get; private set; } = contextManager ?? throw new ArgumentNullException(nameof(contextManager));
    protected DbSet<TEntity> DbSet => Context.Set<TEntity>();
    #endregion

    public virtual async Task<ICollection<TEntity>> GetListAsNoTrackingAsync(CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking().ToListAsync(cancellationToken);

    public virtual async Task<TEntity?> GetSingleAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(expression);
        return await DbSet.AsNoTracking().FirstOrDefaultAsync(expression, cancellationToken);
    }

    public virtual void Create(TEntity entity)
    {
        ArgumentNullException.ThrowIfNull(entity);
        entity.CreatedAt = DateTime.UtcNow;
        entity.DateStamp = DateTime.UtcNow;
        entity.Status = 1;
        DbSet.Add(entity);

        SaveChanges();
    }

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