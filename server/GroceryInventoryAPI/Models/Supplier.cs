using System;

namespace GroceryInventoryAPI.Models;

public class Supplier
{
    public string SupplierID { get; set; } = string.Empty;
    public string SupplierName { get; set; } = string.Empty;

    // Collection of Using Supplier
    public ICollection<Product>? Products { get; set; }
}
