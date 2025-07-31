using System;
using GroceryInventoryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GroceryInventoryAPI.Data;

public class GroceryDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<Inventory> Inventories { get; set; }
    public DbSet<Warehouse> Warehouses { get; set; }
    public DbSet<User> Users { get; set; }

    public GroceryDbContext(DbContextOptions<GroceryDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Inventory>(entity =>
        {
            // Status 
            entity.Property(e => e.Status).HasConversion<string>();
            // Dates
            entity.Property(e => e.DateReceived).HasColumnType("date");
            entity.Property(e => e.LastOrderDate).HasColumnType("date");
            entity.Property(e => e.ExpirationDate).HasColumnType("date");
        });
    }
}
