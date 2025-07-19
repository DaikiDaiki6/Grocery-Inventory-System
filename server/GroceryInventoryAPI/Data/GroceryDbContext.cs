using System;
using Microsoft.EntityFrameworkCore;

namespace GroceryInventoryAPI.Data;

public class GroceryDbContext : DbContext
{
    public GroceryDbContext(DbContextOptions<GroceryDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<Inventory> Inventories { get; set; }
    public DbSet<Warehouse> Warehouses { get; set; }
}
