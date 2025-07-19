using System;

namespace GroceryInventoryAPI.Models;

public class Product
{
    public string ProductID { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;

    // FN
    public int CategoryID { get; set; }
    public string SupplierID { get; set; } = string.Empty;

    //Navigation to the Models of FN
    public Category? Category { get; set; }
    public Supplier? Supplier { get; set; }
    
    // Collection of Using Product
    public ICollection<Inventory>? Inventories { get; set; }
}
