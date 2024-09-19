
using Catalog.Domain.Model;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure;

internal partial class AlmasGalleryContext(DbContextOptions<AlmasGalleryContext> options) : DbContext(options)
{
    public virtual DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new Configurations.ProductConfiguration());

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
