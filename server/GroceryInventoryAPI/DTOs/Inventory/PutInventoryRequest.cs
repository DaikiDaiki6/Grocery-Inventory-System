using System;
using System.ComponentModel.DataAnnotations;
using GroceryInventoryAPI.Models;

namespace GroceryInventoryAPI.DTOs.Inventory;

public class PutInventoryRequest
{
    [Required(ErrorMessage = "Stock quantity is required")]
    [Range(0, int.MaxValue, ErrorMessage = "Stock quantity must be 0 or greater")]
    public int StockQuantity { get; set; }
    [Required(ErrorMessage = "Reorder level is required")]
    [Range(0, int.MaxValue, ErrorMessage = "Reorder level must be 0 or greater")]
    public int ReorderLevel { get; set; }
    [Required(ErrorMessage = "Reorder quantity is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Reorder quantity must be greater than 0")]
    public int ReorderQuantity { get; set; }
    [Required(ErrorMessage = "Unit price is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Unit price must be greater than 0")]
    public decimal UnitPrice { get; set; }
    [Required(ErrorMessage = "Date Received is required")]
    [DataType(DataType.Date)]
    public DateOnly DateReceived { get; set; }
    [DataType(DataType.Date)] // nullable
    public DateOnly? LastOrderDate { get; set; }
    [Required(ErrorMessage = "Expiration date is required")]
    [DataType(DataType.Date)]
    public DateOnly ExpirationDate { get; set; }
    [Required(ErrorMessage = "Sales volume is required")]
    [Range(0, int.MaxValue, ErrorMessage = "Sales volume must be 0 or greater")]
    public int SalesVolume { get; set; }
    [Required(ErrorMessage = "Inventory turnover rate is required")]
    [Range(0, int.MaxValue, ErrorMessage = "Inventory turnover rate must be 0 or greater")]
    public int InventoryTurnoverRate { get; set; }
    [Required(ErrorMessage = "Status is required")]
    public Status Status { get; set; }
    [Required(ErrorMessage = "Product ID is required")]
    [StringLength(11, ErrorMessage = "Product ID must be exactly 11 characters")]
    public string ProductID { get; set; } = string.Empty;
    [Required(ErrorMessage = "Warehouse ID is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Warehouse ID must be greater than 0")]
    public int WarehouseID { get; set; }
}
