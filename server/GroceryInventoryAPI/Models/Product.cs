using System;

namespace GroceryInventoryAPI.Models;

public class Product
{
    public string Product_ID { get; set; } = string.Empty;
    public string Product_Name { get; set; } = string.Empty;

    // FN
    public int Category_ID { get; set; }
    public string Supplier_ID { get; set; } = string.Empty;

    //Navigation to the Models of FN
    public Category? Category { get; set; }
    public Supplier? Supplier { get; set; }
    
}
