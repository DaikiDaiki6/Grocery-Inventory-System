using System;
using GroceryInventoryAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GroceryInventoryAPI.Controllers;

public class SuppliersController : BaseController
{
    private readonly GroceryDbContext _dbContext;

    public SuppliersController(GroceryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllSuppliers()
    {
        var suppliers = await _dbContext.Suppliers
            .Select(i => new
            {
                i.SupplierID,
                i.SupplierName,
                Products = i.Products != null ? i.Products.Select(p => new
                {
                    p.ProductID,
                    p.ProductName
                }) : null,
            })
            .ToListAsync();

        return Ok(suppliers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSpecificSupplier(string id)
    {
        var supplier = await _dbContext.Suppliers
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.SupplierID == id);

        if (supplier == null)
        {
            return NotFound();
        }
        return Ok(new
        {
            supplier.SupplierID,
            supplier.SupplierName,
            Product = supplier.Products != null ? supplier.Products.Select(i => new
            {
                i.ProductID,
                i.ProductName
            }) : null
        });
    }

    [HttpPost]
    public async Task<IActionResult> PostSupplier()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpPut]
    public async Task<IActionResult> PutSupplier()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpPatch]
    public async Task<IActionResult> PatchSupplier()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSupplier(string id)
    {
        var existingSupplier = await _dbContext.Suppliers.FirstOrDefaultAsync(t => t.SupplierID == id);

        if (existingSupplier == null)
        {
            return NotFound();
        }
        _dbContext.Suppliers.Remove(existingSupplier);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }
}
