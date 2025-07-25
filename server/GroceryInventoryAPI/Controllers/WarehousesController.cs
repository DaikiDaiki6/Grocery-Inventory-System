using System;
using GroceryInventoryAPI.Data;
using GroceryInventoryAPI.DTOs.Warehouse;
using GroceryInventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GroceryInventoryAPI.Controllers;

public class WarehousesController : BaseController
{
    private readonly GroceryDbContext _dbContext;
    private readonly ILogger<WarehousesController> _logger;

    public WarehousesController(GroceryDbContext dbContext, ILogger<WarehousesController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves all warehouses along with their inventories.
    /// </summary>
    /// <returns>A list of warehouses.</returns>
    /// <response code="200">Returns the list of warehouses.</response>
    /// <response code="500">Internal server error.</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllWarehouses()
    {

        var warehouses = await _dbContext.Warehouses
            .Include(i => i.Inventories)
            .OrderBy(p => p.WarehouseName)
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

    /// <summary>
    /// Retrieves a specific warehouse by ID.
    /// </summary>
    /// <param name="id">The ID of the warehouse.</param>
    /// <returns>The warehouse with inventories.</returns>
    /// <response code="200">Returns the warehouse.</response>
    /// <response code="404">Warehouse not found.</response>
    /// <response code="500">Internal server error.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetSpecificWarehouse(int id)
    {

        var warehouse = await _dbContext.Warehouses
            .Include(c => c.Inventories)
            .FirstOrDefaultAsync(c => c.WarehouseID == id);

        if (warehouse == null)
        {
            return NotFound($"Warehouse with ID {id} not found.");
        }

        return Ok(new
        {
            warehouse.WarehouseID,
            warehouse.WarehouseName,
            Inventories = warehouse.Inventories?.Select(p => new
            {
                p.InventoryID
            })
        });


    }

    /// <summary>
    /// Creates a new warehouse.
    /// </summary>
    /// <param name="warehouseRequest">Warehouse details.</param>
    /// <returns>The newly created warehouse.</returns>
    /// <response code="201">Warehouse created successfully.</response>
    /// <response code="400">Invalid input data.</response>
    /// <response code="500">Internal server error.</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PostWarehouse([FromBody] PostWarehouseRequest warehouseRequest)
    {

        var newWarehouse = new Warehouse
        {
            WarehouseName = warehouseRequest.WarehouseName,
        };

        _dbContext.Warehouses.Add(newWarehouse);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSpecificWarehouse), new { id = newWarehouse.WarehouseID }, new
        {
            newWarehouse.WarehouseID,
            newWarehouse.WarehouseName
        });

    }

    /// <summary>
    /// Updates the name of an existing warehouse.
    /// </summary>
    /// <param name="id">Warehouse ID.</param>
    /// <param name="warehouseRequest">Warehouse update data.</param>
    /// <returns>The updated warehouse.</returns>
    /// <response code="200">Warehouse updated successfully.</response>
    /// <response code="400">Invalid input data.</response>
    /// <response code="404">Warehouse not found.</response>
    /// <response code="500">Internal server error.</response>
    [HttpPatch("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PatchWarehouse(int id, [FromBody] PatchWarehouseRequest warehouseRequest)
    {

        var existingWarehouse = await _dbContext.Warehouses.FindAsync(id);

        if (existingWarehouse == null)
        {
            return NotFound($"Warehouse with ID {id} not found.");
        }

        if (!string.IsNullOrEmpty(warehouseRequest.WarehouseName))
        {
            existingWarehouse.WarehouseName = warehouseRequest.WarehouseName;
        }

        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            existingWarehouse.WarehouseID,
            existingWarehouse.WarehouseName,
        });

    }

    /// <summary>
    /// Deletes a warehouse by ID.
    /// </summary>
    /// <param name="id">Warehouse ID.</param>
    /// <returns>No content if successful.</returns>
    /// <response code="204">Warehouse deleted successfully.</response>
    /// <response code="404">Warehouse not found.</response>
    /// <response code="500">Internal server error.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteWarehouse(int id)
    {

        var existingWarehouse = await _dbContext.Warehouses.FindAsync(id);

        if (existingWarehouse == null)
        {
            return NotFound($"Warehouse with ID {id} not found.");
        }

        _dbContext.Warehouses.Remove(existingWarehouse);
        await _dbContext.SaveChangesAsync();

        return NoContent();

    }
}
