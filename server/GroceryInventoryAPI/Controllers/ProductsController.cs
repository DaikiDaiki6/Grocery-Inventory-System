using System;
using GroceryInventoryAPI.Data;
using GroceryInventoryAPI.DTOs.Product;
using GroceryInventoryAPI.Models;
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
            return NotFound($"Product with ID {id} not found");
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
    public async Task<IActionResult> PostProduct([FromBody] PostProductRequest productRequest)
    {
       
        var newProduct = new Product
        {
            ProductID = productRequest.ProductID,
            ProductName = productRequest.ProductName,
            CategoryID = productRequest.CategoryID,
            SupplierID = productRequest.SupplierID
        };

        _dbContext.Products.Add(newProduct);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSpecificProduct), new { id = newProduct.ProductID }, newProduct);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutProduct(string id, [FromBody] PutProductRequest productRequest)
    {
        var existingProduct = await _dbContext.Products.FindAsync(id);
        if (existingProduct == null)
        {
            return NotFound();
        }
        existingProduct.ProductName = productRequest.ProductName;
        existingProduct.CategoryID = productRequest.CategoryID;
        existingProduct.SupplierID = productRequest.SupplierID;
        await _dbContext.SaveChangesAsync();

        return Ok(existingProduct);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchProduct(string id, [FromBody] PatchProductRequest productRequest)
    {
        var existingProduct = await _dbContext.Products.FindAsync(id);
        if (existingProduct == null)
        {
            return NotFound();
        }
        if (!string.IsNullOrEmpty(productRequest.ProductName))
        {
            existingProduct.ProductName = productRequest.ProductName;
        }
        if (productRequest.CategoryID.HasValue)
        {
            existingProduct.CategoryID = productRequest.CategoryID.Value;
        }
        if (!string.IsNullOrEmpty(productRequest.SupplierID))
        {
            existingProduct.SupplierID = productRequest.SupplierID;
        }

        await _dbContext.SaveChangesAsync();
        return Ok(existingProduct);
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
