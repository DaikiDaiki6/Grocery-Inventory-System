using System;

namespace GroceryInventoryAPI.DTOs.Product;

public class PutProductRequest
{
    public string ProductName { get; set; } = string.Empty;
    public int CategoryID { get; set; }
    public string SupplierID { get; set; } = string.Empty;
}
