using System;

namespace GroceryInventoryAPI.DTOs.Product;

public class PostProductRequest
{
    public string ProductID { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int CategoryID { get; set; }
    public string SupplierID { get; set; } = string.Empty;
}
