using Microsoft.EntityFrameworkCore.Storage;

namespace AlmasGallery.Catalog.Infrastructure.Repository;

/// <summary>
/// Implementation of the Unit of Work pattern, providing methods to manage database transactions and changes.
/// </summary>
internal partial class UnitOfWork : IUnitOfWork, IDisposable
{
    private IDbContextTransaction? _transaction;

    /// <inheritdoc />
    public AlmasGalleryDbContext? Context { get; } = almasGalleryDbContext ?? throw new NotImplementedException();

    /// <inheritdoc />
    public virtual async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(Context);

        if (_transaction != null)
        {
            return _transaction;
        }

        _transaction = await Context.Database.BeginTransactionAsync(cancellationToken);
        return _transaction;
    }

    /// <inheritdoc />
    public virtual async Task CommitAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction == null)
        {
            throw new InvalidOperationException("No transaction started.");
        }

        await _transaction.CommitAsync(cancellationToken);
        await DisposeTransactionAsync();
    }

    /// <inheritdoc />
    public virtual async Task RollbackAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction == null)
        {
            throw new InvalidOperationException("No transaction started.");
        }

        await _transaction.RollbackAsync(cancellationToken);
        await DisposeTransactionAsync();
    }

    /// <inheritdoc />
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

    /// <inheritdoc />
    public virtual void SaveChanges()
    {
        try
        {
            Context?.SaveChanges();
        }
        catch (Exception)
        {
            throw;
        }
    }

    /// <inheritdoc />
    public virtual async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            if (Context != null)
            {
                await Context.SaveChangesAsync(cancellationToken);
            }
        }
        catch (Exception)
        {
            throw;
        }
    }

    /// <summary>
    /// Disposes the resources used by the unit of work.
    /// </summary>
    public virtual void Dispose() => Dispose(true);

    /// <summary>
    /// Disposes the resources used by the unit of work.
    /// </summary>
    /// <param name="disposing">Indicates whether the method is called from Dispose.</param>
    protected virtual void Dispose(bool disposing)
    {
        if (!disposing)
        {
            return;
        }

        Context?.Dispose();
    }

    /// <summary>
    /// Disposes the current database transaction asynchronously if it exists.
    /// </summary>
    private async Task DisposeTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }
}