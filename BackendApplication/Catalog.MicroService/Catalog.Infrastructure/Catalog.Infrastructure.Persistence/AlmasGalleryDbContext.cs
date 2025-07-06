using AlmasGallery.Catalog.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace AlmasGallery.Catalog.Infrastructure.Persistence;

public partial class AlmasGalleryDbContext(DbContextOptions<AlmasGalleryDbContext> options) : DbContext(options)
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
        modelBuilder.Entity<CustomField>(entity =>
        {
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.CustomFieldGroup).WithMany(p => p.CustomFields)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CustomField_CustomFieldGroup");

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent).HasConstraintName("FK_CustomField_CustomField");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasOne(d => d.ProductCategory).WithMany(p => p.Products)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Product_ProductCategory");
        });

        modelBuilder.Entity<ProductCategory>(entity =>
        {
            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent).HasConstraintName("FK_ProductCategory_ProductCategory");
        });

        modelBuilder.Entity<ProductCategoryCustomFieldGroup>(entity =>
        {
            entity.HasOne(d => d.CustomFieldGroup).WithMany(p => p.ProductCategoryCustomFieldGroups)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductCategoryCustomFieldGroup_CustomFieldGroup");

            entity.HasOne(d => d.ProductCategory).WithMany(p => p.ProductCategoryCustomFieldGroups)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductCategoryCustomFieldGroup_ProductCategory");
        });

        modelBuilder.Entity<ProductInventory>(entity =>
        {
            entity.HasOne(d => d.Inventory).WithMany(p => p.ProductInventories)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductInventory_Inventory");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductInventories)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductInventory_Product");
        });

        modelBuilder.Entity<ProductPrice>(entity =>
        {
            entity.HasOne(d => d.Product).WithMany(p => p.ProductPrices)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductPrice_Product");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
