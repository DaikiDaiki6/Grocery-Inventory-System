using System;
using System.ComponentModel.DataAnnotations;

namespace GroceryInventoryAPI.DTOs.Supplier;

public class PatchSupplierRequest
{
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Supplier name must be between 2 and 100 characters")]
    public string? SupplierName { get; set; }
}
