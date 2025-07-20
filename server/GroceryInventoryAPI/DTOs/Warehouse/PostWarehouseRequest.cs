using System;
using System.ComponentModel.DataAnnotations;

namespace GroceryInventoryAPI.DTOs.Warehouse;

public class PostWarehouseRequest
{
    [Required(ErrorMessage = "Warehouse name is required")]
    [StringLength(150, MinimumLength = 2, ErrorMessage = "Warehouse name must be between 2 and 150 characters")]
    public string WarehouseName { get; set; } = string.Empty; 
}
