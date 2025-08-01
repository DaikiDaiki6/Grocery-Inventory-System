using System;
using System.ComponentModel.DataAnnotations;
using GroceryInventoryAPI.Models;

namespace GroceryInventoryAPI.DTOs.Inventory;

public class PatchInventoryRequest
{
    [Range(0, int.MaxValue, ErrorMessage = "Stock quantity must be 0 or greater")]
    public int? StockQuantity { get; set; }
    [Range(0, int.MaxValue, ErrorMessage = "Reorder level must be 0 or greater")]
    public int? ReorderLevel { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Reorder quantity must be greater than 0")]
    public int? ReorderQuantity { get; set; }
    [Range(0.01, double.MaxValue, ErrorMessage = "Unit price must be greater than 0")]
    public decimal? UnitPrice { get; set; }
    [DataType(DataType.Date)]
    public DateOnly? DateReceived { get; set; }
    [DataType(DataType.Date)]
    public DateOnly? LastOrderDate { get; set; }
    [DataType(DataType.Date)]
    public DateOnly? ExpirationDate { get; set; }
    [Range(0, int.MaxValue, ErrorMessage = "Sales volume must be 0 or greater")]
    public int? SalesVolume { get; set; }
    [Range(0, int.MaxValue, ErrorMessage = "Inventory turnover rate must be 0 or greater")]
    public decimal? InventoryTurnoverRate { get; set; }
    [Range(0, 2, ErrorMessage = "Status must be 0 (Active), 1 (BackOrdered), or 2 (Discontinued)")]
    public Status? Status { get; set; }
    [StringLength(11, MinimumLength = 11, ErrorMessage = "Product ID must be exactly 11 characters")]

    public string? ProductID { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Warehouse ID must be greater than 0")]

    public int? WarehouseID { get; set; }
}
