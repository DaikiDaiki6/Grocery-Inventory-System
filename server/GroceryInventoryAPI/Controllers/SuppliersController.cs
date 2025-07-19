using System;
using GroceryInventoryAPI.Data;
using Microsoft.AspNetCore.Mvc;

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
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSpecificSupplier(int id)
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
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

    [HttpDelete]
    public async Task<IActionResult> DeleteSupplier()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }
}
