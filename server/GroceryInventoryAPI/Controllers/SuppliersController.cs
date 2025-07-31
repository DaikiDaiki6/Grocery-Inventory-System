using System;
using GroceryInventoryAPI.Data;
using GroceryInventoryAPI.DTOs;
using GroceryInventoryAPI.DTOs.Supplier;
using GroceryInventoryAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace GroceryInventoryAPI.Controllers;

public class SuppliersController : BaseController
{
    private readonly GroceryDbContext _dbContext;
    private readonly ILogger<SuppliersController> _logger;

    public SuppliersController(GroceryDbContext dbContext, ILogger<SuppliersController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves all suppliers and their products with pagination.
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20, max: 100)</param>
    /// <returns>Paginated list of suppliers</returns>
    /// <response code="200">Returns the paginated list of suppliers</response>
    /// <response code="400">Invalid pagination parameters</response>
    /// <response code="500">Internal server error</response>
    [HttpGet]
    [Authorize] // Anyone with a valid token can view suppliers
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllSuppliers(
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

        _logger.LogInformation("Fetching suppliers page {PageNumber} with size {PageSize}...", pageNumber, pageSize);

        // Get total count
        var totalCount = await _dbContext.Suppliers.CountAsync();

        // Calculate pagination values
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
        var hasPreviousPage = pageNumber > 1;
        var hasNextPage = pageNumber < totalPages;
        var previousPageNumber = hasPreviousPage ? pageNumber - 1 : 0;
        var nextPageNumber = hasNextPage ? pageNumber + 1 : 0;

        var suppliers = await _dbContext.Suppliers
            .Include(s => s.Products)
            .OrderBy(p => p.SupplierName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(i => new
            {
                i.SupplierID,
                i.SupplierName,
                Products = i.Products != null
                ? i.Products.Select(p => new
                {
                    p.ProductID,
                    p.ProductName
                })
                : null,
            })
            .ToListAsync();

        var response = new PaginationResponse<object>
        {
            Data = suppliers.Cast<object>().ToList(),
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages,
            HasPreviousPage = hasPreviousPage,
            HasNextPage = hasNextPage,
            PreviousPageNumber = previousPageNumber,
            NextPageNumber = nextPageNumber
        };

        _logger.LogInformation("Retrieved {Count} suppliers from page {PageNumber} of {TotalPages}.", 
            suppliers.Count, pageNumber, totalPages);

        return Ok(response);
    }

    /// <summary>
    /// Retrieves a specific supplier by ID.
    /// </summary>
    /// <param name="id">Supplier ID</param>
    /// <returns>A supplier and its products.</returns>
    /// <response code="200">Supplier found</response>
    /// <response code="404">Supplier not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{id}")]
    [Authorize] // Anyone with a valid token can view specific suppliers
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetSpecificSupplier(string id)
    {

        var supplier = await _dbContext.Suppliers
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.SupplierID == id);

        if (supplier == null)
        {
            return NotFound($"Supplier with ID {id} not found.");
        }

        return Ok(new
        {
            supplier.SupplierID,
            supplier.SupplierName,
            Products = supplier.Products?.Select(i => new
            {
                i.ProductID,
                i.ProductName
            })
        });

    }

    /// <summary>
    /// Creates a new supplier.
    /// </summary>
    /// <param name="supplierRequest">Supplier data</param>
    /// <returns>The created supplier</returns>
    /// <response code="201">Supplier created successfully</response>
    /// <response code="400">Invalid supplier input</response>
    /// <response code="500">Internal server error</response>
    [HttpPost]
    [Authorize(Roles = "Admin")] // Only Admin can create suppliers
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PostSupplier([FromBody] PostSupplierRequest supplierRequest)
    {

        var newSupplier = new Supplier
        {
            SupplierID = supplierRequest.SupplierID,
            SupplierName = supplierRequest.SupplierName,
        };

        _dbContext.Suppliers.Add(newSupplier);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSpecificSupplier), new { id = newSupplier.SupplierID }, newSupplier);

    }

    /// <summary>
    /// Updates a supplier's name.
    /// </summary>
    /// <param name="supplierRequest">Supplier data to update</param>
    /// <param name="id">Supplier ID</param>
    /// <returns>The updated supplier</returns>
    /// <response code="200">Supplier updated successfully</response>
    /// <response code="400">Invalid supplier input</response>
    /// <response code="404">Supplier not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPatch("{id}")]
    [Authorize(Roles = "Admin")] // Only Admin can patch suppliers
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PatchSupplier([FromBody] PatchSupplierRequest supplierRequest, string id)
    {

        var existingSupplier = await _dbContext.Suppliers.FindAsync(id);

        if (existingSupplier == null)
        {
            return NotFound($"Supplier with ID {id} not found.");
        }

        if (!string.IsNullOrEmpty(supplierRequest.SupplierName))
        {
            existingSupplier.SupplierName = supplierRequest.SupplierName;
        }

        await _dbContext.SaveChangesAsync();
        return Ok(existingSupplier);

    }

    /// <summary>
    /// Deletes a supplier by ID.
    /// </summary>
    /// <param name="id">Supplier ID</param>
    /// <returns>No content</returns>
    /// <response code="204">Supplier deleted successfully</response>
    /// <response code="404">Supplier not found</response>
    /// <response code="500">Internal server error</response>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] // Only Admin can delete suppliers
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteSupplier(string id)
    {

        var existingSupplier = await _dbContext.Suppliers.FindAsync(id);

        if (existingSupplier == null)
        {
            return NotFound($"Supplier with ID {id} not found.");
        }

        _dbContext.Suppliers.Remove(existingSupplier);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }

}

