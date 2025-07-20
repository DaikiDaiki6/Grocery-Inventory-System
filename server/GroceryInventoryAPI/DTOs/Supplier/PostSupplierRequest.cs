using System;
using System.ComponentModel.DataAnnotations;

namespace GroceryInventoryAPI.DTOs.Supplier;

public class PostSupplierRequest
{
    [Required(ErrorMessage = "Supplier ID is required")]
    [StringLength(11, ErrorMessage = "Supplier ID must be exactly 11 characters")]
    public string SupplierID { get; set; } = string.Empty;
    [Required(ErrorMessage = "Supplier name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Supplier name must be between 2 and 100 characters")]
    public string SupplierName { get; set; } = string.Empty;
}
