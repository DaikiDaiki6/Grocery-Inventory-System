using System;
using GroceryInventoryAPI.Data;
using GroceryInventoryAPI.DTOs;
using GroceryInventoryAPI.DTOs.Warehouse;
using GroceryInventoryAPI.Models;
using Microsoft.AspNetCore.Authorization;
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
    /// Retrieves all warehouses along with their inventories with pagination.
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20, max: 100)</param>
    /// <returns>Paginated list of warehouses</returns>
    /// <response code="200">Returns the paginated list of warehouses</response>
    /// <response code="400">Invalid pagination parameters</response>
    /// <response code="500">Internal server error</response>
    [HttpGet]
    [Authorize] // Anyone with a valid token can view warehouses
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllWarehouses(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        // Validate pagination parameters
        if (pageNumber < 1)
        {
            return BadRequest("Page number must be 1 or greater");
        }

        if (pageSize < 1 || pageSize > 100)
        {
            return BadRequest("Page size must be between 1 and 100");
        }

        _logger.LogInformation("Fetching warehouses page {PageNumber} with size {PageSize}...", pageNumber, pageSize);

        // Get total count
        var totalCount = await _dbContext.Warehouses.CountAsync();

        // Calculate pagination values
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
        var hasPreviousPage = pageNumber > 1;
        var hasNextPage = pageNumber < totalPages;
        var previousPageNumber = hasPreviousPage ? pageNumber - 1 : 0;
        var nextPageNumber = hasNextPage ? pageNumber + 1 : 0;

        var warehouses = await _dbContext.Warehouses
            .Include(i => i.Inventories)
            .OrderBy(p => p.WarehouseName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
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

        var response = new PaginationResponse<object>
        {
            Data = warehouses.Cast<object>().ToList(),
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages,
            HasPreviousPage = hasPreviousPage,
            HasNextPage = hasNextPage,
            PreviousPageNumber = previousPageNumber,
            NextPageNumber = nextPageNumber
        };

        _logger.LogInformation("Retrieved {Count} warehouses from page {PageNumber} of {TotalPages}.", 
            warehouses.Count, pageNumber, totalPages);

        return Ok(response);
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
    [Authorize] // Anyone with a valid token can view specific warehouses
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
    [Authorize(Roles = "Admin")] // Only Admin can create warehouses
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
    [Authorize(Roles = "Admin")] // Only Admin can patch warehouses
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
    [Authorize(Roles = "Admin")] // Only Admin can delete warehouses
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
