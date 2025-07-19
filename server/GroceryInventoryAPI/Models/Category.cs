using System;

namespace GroceryInventoryAPI.Models;

public class Category
{
    public int CategoryID { get; set; }
    public string CategoryName { get; set; } = string.Empty;

    // Collection of Using Categories
    public ICollection<Product>? Products { get; set; }
}
