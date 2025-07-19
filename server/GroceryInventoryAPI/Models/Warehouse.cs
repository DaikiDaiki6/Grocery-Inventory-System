using System;

namespace GroceryInventoryAPI.Models;

public class Warehouse
{
    public int WarehouseID { get; set; }
    public string WarehouseName { get; set; } = string.Empty;

    // Collection of Using Warehouse
    public ICollection<Inventory>? Inventories { get; set; }
}
