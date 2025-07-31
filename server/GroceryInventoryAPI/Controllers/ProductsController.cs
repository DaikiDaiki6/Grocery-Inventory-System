using System;
using GroceryInventoryAPI.Data;
using GroceryInventoryAPI.DTOs;
using GroceryInventoryAPI.DTOs.Product;
using GroceryInventoryAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GroceryInventoryAPI.Controllers;

public class ProductsController : BaseController
{
    private readonly GroceryDbContext _dbContext;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(GroceryDbContext dbContext, ILogger<ProductsController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves all products with category and supplier names with pagination.
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20, max: 100)</param>
    /// <returns>Paginated list of products</returns>
    /// <response code="200">Returns the paginated list of products</response>
    /// <response code="400">Invalid pagination parameters</response>
    /// <response code="500">Internal server error</response>
    [HttpGet]
    [Authorize] // Anyone with a valid token can view products
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllProducts(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        // Validate pagination parameters
        if (pageNumber < 1)
        {
            return BadRequest("Page number must be 1 or greater");
        }

        if (pageSize < 1 || pageSize > 100)
        {
            return BadRequest("Page size must be between 1 and 100");
        }

        _logger.LogInformation("Fetching products page {PageNumber} with size {PageSize}...", pageNumber, pageSize);

        // Get total count
        var totalCount = await _dbContext.Products.CountAsync();

        // Calculate pagination values
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
        var hasPreviousPage = pageNumber > 1;
        var hasNextPage = pageNumber < totalPages;
        var previousPageNumber = hasPreviousPage ? pageNumber - 1 : 0;
        var nextPageNumber = hasNextPage ? pageNumber + 1 : 0;

        var products = await _dbContext.Products
            .Include(i => i.Category)
            .Include(i => i.Supplier)
            .OrderBy(p => p.ProductName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(i => new
            {
                i.ProductID,
                i.ProductName,
                Category = i.Category != null ? i.Category.CategoryName : null,
                Supplier = i.Supplier != null ? i.Supplier.SupplierName : null
            })
            .ToListAsync();

        var response = new PaginationResponse<object>
        {
            Data = products.Cast<object>().ToList(),
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages,
            HasPreviousPage = hasPreviousPage,
            HasNextPage = hasNextPage,
            PreviousPageNumber = previousPageNumber,
            NextPageNumber = nextPageNumber
        };

        _logger.LogInformation("Retrieved {Count} products from page {PageNumber} of {TotalPages}.", 
            products.Count, pageNumber, totalPages);

        return Ok(response);
    }

    /// <summary>
    /// Retrieves a specific product by ID.
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Product details</returns>
    /// <response code="200">Returns the product</response>
    /// <response code="404">Product not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{id}")]
    [Authorize] // Anyone with a valid token can view specific products
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetSpecificProduct(string id)
    {

        var product = await _dbContext.Products
            .Include(c => c.Category)
            .Include(s => s.Supplier)
            .FirstOrDefaultAsync(i => i.ProductID == id);

        if (product == null)
            return NotFound($"Product with ID {id} not found");

        return Ok(new
        {
            product.ProductID,
            product.ProductName,
            Category = product.Category?.CategoryName,
            Supplier = product.Supplier?.SupplierName
        });

    }

    /// <summary>
    /// Creates a new product.
    /// </summary>
    /// <param name="productRequest">Product details</param>
    /// <returns>Created product</returns>
    /// <response code="201">Product created</response>
    /// <response code="400">Invalid input data</response>
    /// <response code="500">Internal server error</response>
    [HttpPost]
    [Authorize(Roles = "Admin")] // Only Admin can create products
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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

        return CreatedAtAction(nameof(GetSpecificProduct), new { id = newProduct.ProductID }, new
        {
            newProduct.ProductID,
            newProduct.ProductName,
            newProduct.CategoryID,
            newProduct.SupplierID
        });

    }

    /// <summary>
    /// Updates a product entirely by ID.
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="productRequest">Updated product data</param>
    /// <returns>Updated product</returns>
    /// <response code="200">Product updated</response>
    /// <response code="400">Invalid input data</response>
    /// <response code="404">Product not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")] // Only Admin can update products
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PutProduct(string id, [FromBody] PutProductRequest productRequest)
    {

        var existingProduct = await _dbContext.Products.FindAsync(id);
        if (existingProduct == null)
        {
            return NotFound($"Product with ID {id} not found");
        }

        existingProduct.ProductName = productRequest.ProductName;
        existingProduct.CategoryID = productRequest.CategoryID;
        existingProduct.SupplierID = productRequest.SupplierID;
        await _dbContext.SaveChangesAsync();

        return Ok(existingProduct);
    }
       

    /// <summary>
    /// Updates specific fields of a product
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="productRequest">Partial product data</param>
    /// <returns>The updated product</returns>
    /// <response code="200">Product updated successfully</response>
    /// <response code="400">Invalid input data</response>
    /// <response code="404">Product not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPatch("{id}")]
    [Authorize(Roles = "Admin")] // Only Admin can patch products
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PatchProduct(string id, [FromBody] PatchProductRequest productRequest)
    {

        var existingProduct = await _dbContext.Products.FindAsync(id);
        if (existingProduct == null)
        {
            return NotFound($"Product with ID {id} not found");
        }

        if (!string.IsNullOrEmpty(productRequest.ProductName))
            existingProduct.ProductName = productRequest.ProductName;

        if (productRequest.CategoryID.HasValue)
            existingProduct.CategoryID = productRequest.CategoryID.Value;

        if (!string.IsNullOrEmpty(productRequest.SupplierID))
            existingProduct.SupplierID = productRequest.SupplierID;

        await _dbContext.SaveChangesAsync();
        return Ok(existingProduct);

    }

    /// <summary>
    /// Deletes a product by ID
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>No content</returns>
    /// <response code="204">Product deleted successfully</response>
    /// <response code="404">Product not found</response>
    /// <response code="500">Internal server error</response>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] // Only Admin can delete products
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteProduct(string id)
    {

        var existingProduct = await _dbContext.Products.FindAsync(id);

        if (existingProduct == null)
        {
            return NotFound($"Product with ID {id} not found");
        }

        _dbContext.Products.Remove(existingProduct);
        await _dbContext.SaveChangesAsync();

        return NoContent();

    }

}
