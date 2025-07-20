using System;
using GroceryInventoryAPI.Models;

namespace GroceryInventoryAPI.DTOs.Inventory;

public class PutInventoryRequest
{
    public int StockQuantity { get; set; }
    public int ReorderLevel { get; set; }
    public int ReorderQuantity { get; set; }
    public decimal UnitPrice { get; set; }
    public DateOnly DateReceived { get; set; }
    public DateOnly LastOrderDate { get; set; }
    public DateOnly ExpirationDate { get; set; }
    public int SalesVolume { get; set; }
    public int InventoryTurnoverRate { get; set; }
    public Status Status { get; set; }

    public string ProductID { get; set; } = string.Empty;
    public int WarehouseID { get; set; }
}
