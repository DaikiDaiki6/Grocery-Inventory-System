using System;
using GroceryInventoryAPI.Data;
using Microsoft.AspNetCore.Mvc;

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
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSpecificCategory(int id)
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
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

    [HttpDelete]
    public async Task<IActionResult> DeleteCategory()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }
}
