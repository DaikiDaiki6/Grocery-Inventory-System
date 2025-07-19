using System;
using GroceryInventoryAPI.Data;
using GroceryInventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GroceryInventoryAPI.Controllers;

public class InventoriesController : BaseController
{
    private readonly GroceryDbContext _dbContext;

    public InventoriesController(GroceryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllInventories()
    {
        var inventories = await _dbContext.Inventories
            .Select(i => new
            {
                i.InventoryID,
                i.StockQuantity,
                i.ReorderLevel,
                i.ReorderQuantity,
                i.UnitPrice,
                i.DateReceived,
                i.LastOrderDate,
                i.ExpirationDate,
                i.SalesVolume,
                i.InventoryTurnoverRate,
                i.Status,
                i.ProductID,
                i.WarehouseID,
                ProductName = i.Product != null ? i.Product.ProductName : null,
                WarehouseName = i.Warehouse != null ? i.Warehouse.WarehouseName : null,
            })
            .ToListAsync();

        return Ok(inventories);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSpecificInventory(int id)
    {
        var inventory = await _dbContext.Inventories
            .Include(c => c.Product)
            .Include(s => s.Warehouse)
            .FirstOrDefaultAsync(i => i.InventoryID == id);

        if (inventory == null)
        {
            return NotFound($"Inventory with ID {id} not found");
        }

        return Ok(new
        {
            inventory.InventoryID,
            inventory.StockQuantity,
            inventory.ReorderLevel,
            inventory.ReorderQuantity,
            inventory.UnitPrice,
            inventory.DateReceived,
            inventory.LastOrderDate,
            inventory.ExpirationDate,
            inventory.SalesVolume,
            inventory.InventoryTurnoverRate,
            inventory.Status,
            Product = inventory.Product != null ? new
            {
                inventory.Product.ProductID,
                inventory.Product.ProductName
            }: null,
            Warehouse = inventory.Warehouse != null ? new
            {
                inventory.Warehouse.WarehouseID,
                inventory.Warehouse.WarehouseName
            } : null
        });
    }

    [HttpPost]
    public async Task<IActionResult> PostInventory()
    {
        return await Task.FromResult(Ok("Stub: PostInventory"));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutInventory(int id)
    {
        return await Task.FromResult(Ok($"Stub: PutInventory for ID {id}"));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchInventory(int id)
    {
        return await Task.FromResult(Ok($"Stub: PatchInventory for ID {id}"));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInventory(int id)
    {
        var existingInventory = await _dbContext.Inventories.FirstOrDefaultAsync(t => t.InventoryID == id);

        if (existingInventory == null)
        {
            return NotFound();
        }
        _dbContext.Inventories.Remove(existingInventory);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }
}
