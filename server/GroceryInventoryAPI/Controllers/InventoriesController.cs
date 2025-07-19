using System;
using GroceryInventoryAPI.Data;
using Microsoft.AspNetCore.Mvc;

namespace GroceryInventoryAPI.Controllers;

public class InventoriesController : BaseController
{
    private readonly GroceryDbContext _dbContext;

    public InventoriesController(GroceryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllInventories()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSpecificInventory(int id)
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpPost]
    public async Task<IActionResult> PostInventory()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpPut]
    public async Task<IActionResult> PutInventory()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpPatch]
    public async Task<IActionResult> PatchInventory()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteInventory()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }
}
