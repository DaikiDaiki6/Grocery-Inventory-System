using System;
using GroceryInventoryAPI.Data;
using GroceryInventoryAPI.DTOs.Supplier;
using GroceryInventoryAPI.Models;
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
    /// Retrieves all suppliers and their products.
    /// </summary>
    /// <returns>A list of suppliers.</returns>
    /// <response code="200">Returns the list of suppliers</response>
    /// <response code="500">Internal server error</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllSuppliers()
    {

        var suppliers = await _dbContext.Suppliers
            .Include(s => s.Products)
            .OrderBy(p => p.SupplierName)
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

        return Ok(suppliers);

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

