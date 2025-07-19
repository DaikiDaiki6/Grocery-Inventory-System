using System;
using GroceryInventoryAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GroceryInventoryAPI.Controllers;

public class TestController : BaseController
{
    private readonly GroceryDbContext _dbContext;

    public TestController(GroceryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _dbContext.Products
            .Select(p => new
            {
                p.ProductID,
                p.ProductName,
                p.CategoryID,
                p.SupplierID,
                CategoryName = p.Category != null ? p.Category.CategoryName : null,
                SupplierName = p.Supplier != null ? p.Supplier.SupplierName : null
            })
            .ToListAsync();

        return Ok(products);
    }
}
