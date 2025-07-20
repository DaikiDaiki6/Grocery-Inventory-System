using System;
using System.ComponentModel.DataAnnotations;

namespace GroceryInventoryAPI.DTOs.Category;

public class PatchCategoryRequest
{
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Category name must be between 2 and 100 characters")]
    public string? CategoryName { get; set; } 
}
