using System;

namespace GroceryInventoryAPI.Models;

public enum Status
{
    Active,
    BackOrdered,
    Discontinued
}

public class Inventory
{
    public int InventoryID { get; set; }
    public int StockQuantity { get; set; }
    public int ReorderLevel { get; set; }
    public int ReorderQuantity { get; set; }
    public decimal UnitPrice { get; set; }
    public DateOnly DateReceived { get; set; }
    public DateOnly? LastOrderDate { get; set; }
    public DateOnly ExpirationDate { get; set; }
    public int SalesVolume { get; set; }
    public decimal InventoryTurnoverRate { get; set; }
    public Status Status { get; set; }

    // FN
    public string ProductID { get; set; } = string.Empty;
    public int WarehouseID { get; set; }

    // Navigate link of FN
    public Product? Product { get; set; }
    public Warehouse? Warehouse { get; set; }

}

