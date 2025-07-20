using System;
using System.ComponentModel.DataAnnotations;

namespace GroceryInventoryAPI.DTOs.Product;

public class PostProductRequest
{
    [Required(ErrorMessage = "Product ID is required")]
    [StringLength(11, MinimumLength = 11, ErrorMessage = "Product ID must be exactly 11 characters")]
    public string ProductID { get; set; } = string.Empty;
    [Required(ErrorMessage = "Product name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Product name must be between 2 and 100 characters")]
    public string ProductName { get; set; } = string.Empty;
    [Required(ErrorMessage = "Category ID is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Category ID must be greater than 0")]
    public int CategoryID { get; set; }
    [Required(ErrorMessage = "Supplier ID is required")]
    [StringLength(11, MinimumLength = 11, ErrorMessage = "Supplier ID must be exactly 11 characters")]
    public string SupplierID { get; set; } = string.Empty;
}
