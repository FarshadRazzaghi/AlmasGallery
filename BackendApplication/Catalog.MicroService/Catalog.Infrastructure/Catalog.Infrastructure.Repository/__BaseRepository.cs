using Catalog.Infrastructure.Repository.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Linq.Expressions;

namespace Catalog.Infrastructure.Repository;

/// <summary>
/// Base repository class providing common data access methods.
/// </summary>
/// <typeparam name="TEntity">The type of the entity.</typeparam>
internal partial class BaseRepository<TEntity>(AlmasGalleryContext contextManager)
    : IBaseRepository<TEntity> where TEntity : class, IBaseEntity
{
    #region Initialize
    /// <summary>
    /// Indicates whether the repository has been disposed.
    /// </summary>
    private bool _disposed = false;

    /// <summary>
    /// Gets the database context.
    /// </summary>
    protected AlmasGalleryContext Context { get; private set; } = contextManager ?? throw new ArgumentNullException(nameof(contextManager));

    /// <summary>
    /// Gets the database set for the entity.
    /// </summary>
    protected DbSet<TEntity> DbSet => Context.Set<TEntity>();
    #endregion

    /// <inheritdoc />
    public virtual Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
        => Context.Database.BeginTransactionAsync(cancellationToken);

    /// <inheritdoc />
    public virtual async Task<ICollection<TEntity>> GetListAsNoTrackingAsync(CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking().ToListAsync(cancellationToken);

    /// <inheritdoc />
    public virtual async Task<ICollection<TEntity>> GetListAsNoTrackingAsync(int page = 1, int pageSize = 100, CancellationToken cancellationToken = default)
    {
        return await DbSet.AsNoTracking().Skip((page - 1) * pageSize)
                                         .Take(pageSize)
                                         .OrderBy(x => x.Id)
                                         .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public virtual async Task<ICollection<TEntity>> GetListAsNoTrackingAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default, params Expression<Func<TEntity, object>>[] includeExpressions)
    {
        ArgumentNullException.ThrowIfNull(expression);
        var dbSet = DbSet.AsNoTracking().Where(expression);

        if (includeExpressions != null && includeExpressions.Length != 0)
        {
            return await dbSet.Including(includeExpressions).ToListAsync(cancellationToken);
        }

        return await dbSet.ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public virtual async Task<ICollection<TEntity>> GetListAsNoTrackingAsync(Expression<Func<TEntity, bool>> expression, int page = 1, int pageSize = 100, CancellationToken cancellationToken = default, params Expression<Func<TEntity, object>>[] includeExpressions)
    {
        ArgumentNullException.ThrowIfNull(expression);
        var dbSet = DbSet.AsNoTracking()
                         .Where(expression)
                         .OrderBy(x => x.Id)
                         .Skip((page - 1) * pageSize)
                         .Take(pageSize);

        if (includeExpressions != null && includeExpressions.Length != 0)
        {
            return await dbSet.Including(includeExpressions).ToListAsync(cancellationToken);
        }

        return await dbSet.ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public virtual async Task<TEntity?> GetSingleAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(expression);
        return await DbSet.AsNoTracking().FirstOrDefaultAsync(expression, cancellationToken);
    }

    /// <inheritdoc />
    public virtual async Task<TEntity?> GetSingleAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default, params Expression<Func<TEntity, object>>[] includeExpressions)
    {
        ArgumentNullException.ThrowIfNull(expression);
        var dbSet = DbSet.AsNoTracking();

        if (includeExpressions != null && includeExpressions.Length != 0)
        {
            return await dbSet.Including(includeExpressions).FirstOrDefaultAsync(expression, cancellationToken);
        }

        return await dbSet.FirstOrDefaultAsync(expression, cancellationToken);
    }

    /// <inheritdoc />
    public virtual async Task<long> GetCountAsync(Expression<Func<TEntity, bool>> expression, CancellationToken cancellationToken = default!)
    {
        ArgumentNullException.ThrowIfNull(expression);
        var dbSet = DbSet.AsNoTracking();
        return await dbSet.CountAsync(expression, cancellationToken);
    }

    /// <inheritdoc />
    public virtual void Create(TEntity entity)
    {
        ArgumentNullException.ThrowIfNull(entity);
        entity.DateStamp = DateTime.UtcNow;
        entity.Status = (byte)Common.EntityStatus.Active;

        DbSet.Add(entity);
        SaveChanges();
    }

    /// <inheritdoc />
    public virtual void Update(TEntity entity)
    {
        ArgumentNullException.ThrowIfNull(entity);
        entity.DateStamp = DateTime.UtcNow;

        var existingEntity = DbSet.Find(entity.Id);
        if (existingEntity != null)
        {
            DbSet.Entry(existingEntity).CurrentValues.SetValues(entity);
        }
        else
        {
            DbSet.Entry(entity).State = EntityState.Modified;
        }

        SaveChanges();
    }

    /// <inheritdoc />
    public virtual void Delete(TEntity entity)
    {
        ArgumentNullException.ThrowIfNull(entity);

        DbSet.Remove(entity);
        SaveChanges();
    }

    /// <inheritdoc />
    public virtual void DeleteRange(params TEntity[] entities)
    {
        DbSet.RemoveRange(entities);
        SaveChanges();
    }

    #region Save/Discard
    /// <summary>
    /// Discards all changes made in the context.
    /// </summary>
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

    /// <summary>
    /// Saves all changes made in the context to the database.
    /// </summary>
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

    /// <summary>
    /// Asynchronously saves all changes made in the context to the database.
    /// </summary>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    public virtual async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            if (Context != null)
            {
                await Context.SaveChangesAsync(cancellationToken);
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
    /// <summary>
    /// Disposes the repository and releases resources.
    /// </summary>
    public void Dispose()
    {
        Dispose(true);
    }

    /// <summary>
    /// Disposes the repository and releases resources.
    /// </summary>
    /// <param name="disposing">Indicates whether the method is called from Dispose.</param>
    protected virtual void Dispose(bool disposing)
    {
        if (_disposed) return;
        _disposed = true;
    }
    #endregion IDisposable
}