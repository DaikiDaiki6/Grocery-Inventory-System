using System;
using GroceryInventoryAPI.Data;
using GroceryInventoryAPI.DTOs.Inventory;
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
    public async Task<IActionResult> PostInventory([FromBody] PostInventoryRequest inventoryRequest)
    {
        var newInventory = new Inventory
        {
            StockQuantity = inventoryRequest.StockQuantity,
            ReorderLevel = inventoryRequest.ReorderLevel,
            ReorderQuantity = inventoryRequest.ReorderQuantity,
            UnitPrice = inventoryRequest.UnitPrice,
            DateReceived = inventoryRequest.DateReceived!.Value,
            LastOrderDate = inventoryRequest.LastOrderDate,
            ExpirationDate = inventoryRequest.ExpirationDate!.Value,
            SalesVolume = inventoryRequest.SalesVolume,
            InventoryTurnoverRate = inventoryRequest.InventoryTurnoverRate,
            Status = inventoryRequest.Status,
            ProductID = inventoryRequest.ProductID,
            WarehouseID = inventoryRequest.WarehouseID
        };

        _dbContext.Inventories.Add(newInventory);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSpecificInventory), new { id = newInventory.InventoryID }, newInventory);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutInventory(int id, [FromBody] PutInventoryRequest inventoryRequest)
    {
        var existingInventory = await _dbContext.Inventories.FindAsync(id);
        if (existingInventory == null)
        {
            return NotFound();
        }
        existingInventory.StockQuantity = inventoryRequest.StockQuantity;
        existingInventory.ReorderLevel = inventoryRequest.ReorderLevel;
        existingInventory.ReorderQuantity = inventoryRequest.ReorderQuantity;
        existingInventory.UnitPrice = inventoryRequest.UnitPrice;
        existingInventory.DateReceived = inventoryRequest.DateReceived!.Value;
        existingInventory.LastOrderDate = inventoryRequest.LastOrderDate;
        existingInventory.ExpirationDate = inventoryRequest.ExpirationDate!.Value;
        existingInventory.SalesVolume = inventoryRequest.SalesVolume;
        existingInventory.InventoryTurnoverRate = inventoryRequest.InventoryTurnoverRate;
        existingInventory.Status = inventoryRequest.Status;
        existingInventory.ProductID = inventoryRequest.ProductID;
        existingInventory.WarehouseID = inventoryRequest.WarehouseID;
        await _dbContext.SaveChangesAsync();

        return Ok(existingInventory);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchInventory(int id, [FromBody] PatchInventoryRequest inventoryRequest)
    {
        var existingInventory = await _dbContext.Inventories.FindAsync(id);
        if (existingInventory == null)
        {
            return NotFound();
        }
        if (inventoryRequest.StockQuantity.HasValue)
        {
            existingInventory.StockQuantity = inventoryRequest.StockQuantity.Value;
        }
        if (inventoryRequest.ReorderLevel.HasValue)
        {
            existingInventory.ReorderLevel = inventoryRequest.ReorderLevel.Value;
        }
        if (inventoryRequest.ReorderQuantity.HasValue)
        {
            existingInventory.ReorderQuantity = inventoryRequest.ReorderQuantity.Value;
        }
        if (inventoryRequest.UnitPrice.HasValue)
        {
            existingInventory.UnitPrice = inventoryRequest.UnitPrice.Value;
        }
        if (inventoryRequest.DateReceived.HasValue)
        {
            existingInventory.DateReceived = inventoryRequest.DateReceived.Value;
        }
        if (inventoryRequest.LastOrderDate.HasValue)
        {
            existingInventory.LastOrderDate = inventoryRequest.LastOrderDate.Value;
        }
        if (inventoryRequest.ExpirationDate.HasValue)
        {
            existingInventory.ExpirationDate = inventoryRequest.ExpirationDate.Value;
        }
        if (inventoryRequest.SalesVolume.HasValue)
        {
            existingInventory.SalesVolume = inventoryRequest.SalesVolume.Value;
        }
        if (inventoryRequest.InventoryTurnoverRate.HasValue)
        {
            existingInventory.InventoryTurnoverRate = inventoryRequest.InventoryTurnoverRate.Value;
        }
        if (inventoryRequest.Status.HasValue)
        {
            existingInventory.Status = inventoryRequest.Status.Value;
        }
        if (!string.IsNullOrEmpty(inventoryRequest.ProductID))
        {
            existingInventory.ProductID = inventoryRequest.ProductID;
        }
        if (inventoryRequest.WarehouseID.HasValue)
        {
            existingInventory.WarehouseID = inventoryRequest.WarehouseID.Value;
        }

        await _dbContext.SaveChangesAsync();
        return Ok(existingInventory);
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
