using System;
using GroceryInventoryAPI.Data;
using GroceryInventoryAPI.DTOs;
using GroceryInventoryAPI.DTOs.Inventory;
using GroceryInventoryAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GroceryInventoryAPI.Controllers;

public class InventoriesController : BaseController
{
    private readonly GroceryDbContext _dbContext;
    private readonly ILogger<InventoriesController> _logger;


    public InventoriesController(GroceryDbContext dbContext, ILogger<InventoriesController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Gets all inventories with pagination.
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20, max: 100)</param>
    /// <returns>Paginated list of inventories</returns>
    /// <response code="200">Inventories retrieved successfully</response>
    /// <response code="400">Invalid pagination parameters</response>
    /// <response code="500">Internal server error</response>
    [HttpGet]
    [Authorize] // Anyone with a valid token can view inventories
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllInventories(
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

        _logger.LogInformation("Fetching inventories page {PageNumber} with size {PageSize}...", pageNumber, pageSize);

        // Get total count
        var totalCount = await _dbContext.Inventories.CountAsync();

        // Calculate pagination values
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
        var hasPreviousPage = pageNumber > 1;
        var hasNextPage = pageNumber < totalPages;
        var previousPageNumber = hasPreviousPage ? pageNumber - 1 : 0;
        var nextPageNumber = hasNextPage ? pageNumber + 1 : 0;

        var inventories = await _dbContext.Inventories
            .Include(i => i.Product)
            .Include(i => i.Warehouse)
            .OrderBy(p => p.InventoryID)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
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

        var response = new PaginationResponse<object>
        {
            Data = inventories.Cast<object>().ToList(),
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages,
            HasPreviousPage = hasPreviousPage,
            HasNextPage = hasNextPage,
            PreviousPageNumber = previousPageNumber,
            NextPageNumber = nextPageNumber
        };

        _logger.LogInformation("Retrieved {Count} inventories from page {PageNumber} of {TotalPages}.", 
            inventories.Count, pageNumber, totalPages);

        return Ok(response);
    }

    /// <summary>
    /// Gets a specific inventory by ID
    /// </summary>
    /// <param name="id">Inventory ID</param>
    /// <returns>Inventory object</returns>
    /// <response code="200">Inventory retrieved successfully</response>
    /// <response code="404">Inventory not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{id}")]
    [Authorize] // Anyone with a valid token can view specific inventories
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetSpecificInventory(int id)
    {

        _logger.LogInformation("Fetching inventory with ID {Id}", id);
        var inventory = await _dbContext.Inventories
        .Include(c => c.Product)
        .Include(s => s.Warehouse)
        .FirstOrDefaultAsync(i => i.InventoryID == id);

        if (inventory == null)
        {
            _logger.LogWarning("Inventory with ID {Id} not found.", id);
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
            } : null,
            Warehouse = inventory.Warehouse != null ? new
            {
                inventory.Warehouse.WarehouseID,
                inventory.Warehouse.WarehouseName
            } : null
        });


    }

    /// <summary>
    /// Creates a new inventory record
    /// </summary>
    /// <param name="inventoryRequest">Inventory data</param>
    /// <returns>Created inventory</returns>
    /// <response code="201">Inventory created successfully</response>
    /// <response code="400">Invalid input data</response>
    /// <response code="500">Internal server error</response>
    [HttpPost]
    [Authorize(Roles = "Admin")] // Only Admin can create inventories
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PostInventory([FromBody] PostInventoryRequest inventoryRequest)
    {

        _logger.LogInformation("Creating a new inventory record...");

        if (inventoryRequest.DateReceived == null)
        {
            return BadRequest("DateReceived is required.");
        }
        if (inventoryRequest.ExpirationDate == null)
        {
            return BadRequest("ExpirationDate is required.");
        }

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

    /// <summary>
    /// Updates an inventory record entirely
    /// </summary>
    /// <param name="id">Inventory ID</param>
    /// <param name="inventoryRequest">Updated inventory data</param>
    /// <returns>Updated inventory</returns>
    /// <response code="200">Inventory updated successfully</response>
    /// <response code="400">Invalid input data</response>
    /// <response code="404">Inventory not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")] // Only Admin can update inventories
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PutInventory(int id, [FromBody] PutInventoryRequest inventoryRequest)
    {

        _logger.LogInformation("Updating inventory with ID {Id}", id);
        var existingInventory = await _dbContext.Inventories.FindAsync(id);
        if (existingInventory == null)
        {
            return NotFound($"Inventory with ID {id} not found.");
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

    /// <summary>
    /// Partially updates an inventory record
    /// </summary>
    /// <param name="id">Inventory ID</param>
    /// <param name="inventoryRequest">Partial inventory data</param>
    /// <returns>Updated inventory</returns>
    /// <response code="200">Inventory updated successfully</response>
    /// <response code="400">Invalid input data</response>
    /// <response code="404">Inventory not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPatch("{id}")]
    [Authorize(Roles = "Admin")] // Only Admin can patch inventories
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PatchInventory(int id, [FromBody] PatchInventoryRequest inventoryRequest)
    {

        _logger.LogInformation("Patching inventory with ID {Id}", id);
        var existingInventory = await _dbContext.Inventories.FindAsync(id);
        if (existingInventory == null)
        {
            return NotFound($"Inventory with ID {id} not found.");
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

    /// <summary>
    /// Deletes an inventory by ID
    /// </summary>
    /// <param name="id">Inventory ID</param>
    /// <returns>No content</returns>
    /// <response code="204">Inventory deleted successfully</response>
    /// <response code="404">Inventory not found</response>
    /// <response code="500">Internal server error</response>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] // Only Admin can delete inventories
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteInventory(int id)
    {

        _logger.LogInformation("Deleting inventory with ID {Id}", id);

        var existingInventory = await _dbContext.Inventories.FindAsync(id);
        if (existingInventory == null)
        {
            _logger.LogWarning("Inventory with ID {Id} not found.", id);
            return NotFound($"Inventory with ID {id} not found.");
        }

        _dbContext.Inventories.Remove(existingInventory);
        await _dbContext.SaveChangesAsync();

        return NoContent();

    }
}
