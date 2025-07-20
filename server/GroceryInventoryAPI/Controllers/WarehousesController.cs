using System;
using GroceryInventoryAPI.Data;
using GroceryInventoryAPI.DTOs.Warehouse;
using GroceryInventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GroceryInventoryAPI.Controllers;

public class WarehousesController : BaseController
{
    private readonly GroceryDbContext _dbContext;

    public WarehousesController(GroceryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllWarehouses()
    {
        var warehouses = await _dbContext.Warehouses
            .Select(i => new
            {
                i.WarehouseID,
                i.WarehouseName,
                Inventories = i.Inventories != null ? i.Inventories.Select(p => new
                {
                    p.InventoryID,
                }) : null,
            })
            .ToListAsync();

        return Ok(warehouses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSpecificWarehouse(int id)
    {
        var warehouse = await _dbContext.Warehouses
            .Include(c => c.Inventories)
            .FirstOrDefaultAsync(c => c.WarehouseID == id);
        if (warehouse == null)
        {
            return NotFound();
        }

        return Ok(new
        {
            warehouse.WarehouseID,
            warehouse.WarehouseName,
            Inventories = warehouse.Inventories != null ? warehouse.Inventories.Select(p => new
            {
                p.InventoryID
            }) : null,
        });
    }

    [HttpPost]
    public async Task<IActionResult> PostWarehouse([FromBody] PostWarehouseRequest warehouseRequest)
    {
        var newWarehouse = new Warehouse
        {
            WarehouseName = warehouseRequest.WarehouseName,
        };

        _dbContext.Warehouses.Add(newWarehouse);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSpecificWarehouse), new { id = newWarehouse.WarehouseID }, newWarehouse);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchWarehouse(int id, [FromBody] PatchWarehouseRequest warehouseRequest)
    {
        var existingWarehouse = await _dbContext.Warehouses.FindAsync(id);
        if (existingWarehouse == null)
        {
            return NotFound();
        }
        existingWarehouse.WarehouseName = warehouseRequest.WarehouseName;
        await _dbContext.SaveChangesAsync();
        return Ok(new
        {
            existingWarehouse.WarehouseID,
            existingWarehouse.WarehouseName,
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWarehouse(int id)
    {
        var existingWarehouse = await _dbContext.Warehouses.FirstOrDefaultAsync(t => t.WarehouseID == id);

        if (existingWarehouse == null)
        {
            return NotFound();
        }
        _dbContext.Warehouses.Remove(existingWarehouse);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }
}
