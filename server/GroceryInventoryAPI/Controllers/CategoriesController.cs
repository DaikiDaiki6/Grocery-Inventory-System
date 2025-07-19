using System;
using GroceryInventoryAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GroceryInventoryAPI.Controllers;

public class CategoriesController : BaseController
{
    private readonly GroceryDbContext _dbContext;

    public CategoriesController(GroceryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await _dbContext.Categories
            .Select(p => new
            {
                p.CategoryID,
                p.CategoryName
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSpecificCategory(int id)
    {
        var category = await _dbContext.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.CategoryID == id);

        if (category == null)
        {
            return NotFound($"Category with ID {id} not found");
        }

        return Ok(new
        {
            category.CategoryID,
            category.CategoryName,
            Products = category.Products?.Select(p => new
            {
                p.ProductID,
                p.ProductName  
            })
        });
    }

    [HttpPost]
    public async Task<IActionResult> PostCategory()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpPatch]
    public async Task<IActionResult> PatchCategory()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var existingCategory = await _dbContext.Categories.FirstOrDefaultAsync(t => t.CategoryID == id);

        if (existingCategory == null)
        {
            return NotFound();
        }
        _dbContext.Categories.Remove(existingCategory);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }
}
