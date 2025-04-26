namespace Catalog.Infrastructure.Repository;

/// <summary>
/// Implementation of the Unit of Work pattern, providing methods to manage database transactions and changes.
/// </summary>
internal partial class UnitOfWork : IUnitOfWork, IDisposable
{
    /// <inheritdoc />
    public AlmasGalleryContext? Context { get; } = almasGalleryContext ?? throw new NotImplementedException();

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
    public virtual async Task SaveChangesAsync()
    {
        try
        {
            if (Context != null)
            {
                await Context.SaveChangesAsync();
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
}