using System;
using GroceryInventoryAPI.Data;
using Microsoft.AspNetCore.Mvc;

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
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSpecificProduct(int id)
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
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

    [HttpDelete]
    public async Task<IActionResult> DeleteProduct()
    {
        return await Task.FromResult(Ok("Stub: GetAllInventories"));
    }

}
