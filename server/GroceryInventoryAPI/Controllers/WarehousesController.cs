using System;
using GroceryInventoryAPI.Data;
using Microsoft.AspNetCore.Mvc;

namespace GroceryInventoryAPI.Controllers;

public class WarehousesController : BaseController
{
    private readonly GroceryDbContext _dbContext;

    public WarehousesController(GroceryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllWarehouses()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSpecificWarehouse(int id)
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpPost]
    public async Task<IActionResult> PostWarehouse()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpPut]
    public async Task<IActionResult> PutWarehouse()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteWarehouse()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }
}
