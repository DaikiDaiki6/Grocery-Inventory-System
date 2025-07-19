using System;
using GroceryInventoryAPI.Data;
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
    public async Task<IActionResult> PostWarehouse()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpPut]
    public async Task<IActionResult> PutWarehouse()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
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
