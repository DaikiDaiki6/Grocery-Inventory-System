using System;
using GroceryInventoryAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GroceryInventoryAPI.Controllers;

public class ProductsController : BaseController
{
    private readonly GroceryDbContext _dbContext;

    public ProductsController(GroceryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _dbContext.Products
            .Select(i => new
            {
                i.ProductID,
                i.ProductName,
                Category = i.Category != null ? i.Category.CategoryName : null,
                Supplier = i.Supplier != null ? i.Supplier.SupplierName : null
            })
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSpecificProduct(string id)
    {
        var product = await _dbContext.Products
            .Include(c => c.Category)
            .Include(s => s.Supplier)
            .FirstOrDefaultAsync(i => i.ProductID == id);

        if (product == null)
        {
            return NotFound($"Inventory with ID {id} not found");
        }

        return Ok(new
        {
            product.ProductID,
            product.ProductName,
            Category = product.Category != null ? product.Category.CategoryName : null,
            Supplier = product.Supplier != null ? product.Supplier.SupplierName : null
        });
    }

    [HttpPost]
    public async Task<IActionResult> PostProduct()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpPut]
    public async Task<IActionResult> PutProduct()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpPatch]
    public async Task<IActionResult> PatchProduct()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        var existingProduct = await _dbContext.Products.FirstOrDefaultAsync(t => t.ProductID == id);

        if (existingProduct == null)
        {
            return NotFound();
        }
        _dbContext.Products.Remove(existingProduct);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }

}
