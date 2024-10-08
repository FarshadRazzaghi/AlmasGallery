﻿namespace Catalog.Infrastructure.Repository;

internal partial class UnitOfWork : IUnitOfWork
{
    protected AlmasGalleryContext? Context { get; set; }

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
            Context?.SaveChanges();
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
            }
        }
        catch (Exception)
        {
            throw;
        }
    }

    public virtual void Dispose() => Dispose(true);

    protected virtual void Dispose(bool disposing)
    {
        if (!disposing)
        {
            return;
        }

        Context?.Dispose();
    }
}