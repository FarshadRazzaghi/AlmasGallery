
using Catalog.Domain.Models;
using Microsoft.EntityFrameworkCore;
namespace Catalog.Infrastructure.Persistence;

public partial class AlmasGalleryContext(DbContextOptions<AlmasGalleryContext> options) : DbContext(options)
{
    public virtual DbSet<CustomField> CustomFields { get; set; }

    public virtual DbSet<CustomFieldGroup> CustomFieldGroups { get; set; }

    public virtual DbSet<Inventory> Inventories { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductCategory> ProductCategories { get; set; }

    public virtual DbSet<ProductCategoryCustomFieldGroup> ProductCategoryCustomFieldGroups { get; set; }

    public virtual DbSet<ProductInventory> ProductInventories { get; set; }

    public virtual DbSet<ProductPrice> ProductPrices { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new Configurations.CustomFieldConfiguration());
        modelBuilder.ApplyConfiguration(new Configurations.ProductConfiguration());
        modelBuilder.ApplyConfiguration(new Configurations.ProductCategoryConfiguration());
        modelBuilder.ApplyConfiguration(new Configurations.ProductCategoryCustomFieldGroupConfiguration());
        modelBuilder.ApplyConfiguration(new Configurations.ProductInventoryConfiguration());
        modelBuilder.ApplyConfiguration(new Configurations.ProductPriceConfiguration());

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
