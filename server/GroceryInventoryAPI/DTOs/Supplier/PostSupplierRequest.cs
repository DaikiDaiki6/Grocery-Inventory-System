using System;

namespace GroceryInventoryAPI.DTOs.Supplier;

public class PostSupplierRequest
{
    public string SupplierID { get; set; } = string.Empty;
    public string SupplierName { get; set; } = string.Empty;
}
