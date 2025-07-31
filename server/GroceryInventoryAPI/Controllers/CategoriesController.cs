using System;
using GroceryInventoryAPI.Data;
using GroceryInventoryAPI.DTOs;
using GroceryInventoryAPI.DTOs.Category;
using GroceryInventoryAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GroceryInventoryAPI.Controllers;

[Authorize]
public class CategoriesController : BaseController
{
    private readonly GroceryDbContext _dbContext;
    private readonly ILogger<CategoriesController> _logger;
    public CategoriesController(GroceryDbContext dbContext, ILogger<CategoriesController> logger)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    /// <summary>
    /// Gets all categories with pagination
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20, max: 100)</param>
    /// <returns>Paginated list of categories</returns>
    /// <response code="200">Categories retrieved successfully</response>
    /// <response code="400">Invalid pagination parameters</response>
    /// <response code="500">Internal server error</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllCategories(
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

        _logger.LogInformation("Fetching categories page {PageNumber} with size {PageSize}...", pageNumber, pageSize);

        // Get total count
        var totalCount = await _dbContext.Categories.CountAsync();

        // Calculate pagination values
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
        var hasPreviousPage = pageNumber > 1;
        var hasNextPage = pageNumber < totalPages;
        var previousPageNumber = hasPreviousPage ? pageNumber - 1 : 0;
        var nextPageNumber = hasNextPage ? pageNumber + 1 : 0;

        // Get paginated data
        var categories = await _dbContext.Categories
            .OrderBy(p => p.CategoryName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.CategoryID,
                p.CategoryName
            })
            .ToListAsync();

        var response = new PaginationResponse<object>
        {
            Data = categories.Cast<object>().ToList(),
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages,
            HasPreviousPage = hasPreviousPage,
            HasNextPage = hasNextPage,
            PreviousPageNumber = previousPageNumber,
            NextPageNumber = nextPageNumber
        };

        _logger.LogInformation("Retrieved {Count} categories from page {PageNumber} of {TotalPages}.", 
            categories.Count, pageNumber, totalPages);
        
        return Ok(response);
    }

    /// <summary>
    /// Gets a specific category by ID
    /// </summary>
    /// <param name="id">Category ID</param>
    /// <returns>Category with matching ID</returns>
    /// <response code="200">Category retrieved successfully</response>
    /// <response code="404">Category not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetSpecificCategory(int id)
    {

        _logger.LogInformation("Fetching category with ID {Id}", id);

        var category = await _dbContext.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.CategoryID == id);

        if (category == null)
        {
            _logger.LogWarning("Category with ID {Id} not found.", id);
            return NotFound($"Category with ID {id} not found.");
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

    /// <summary>
    /// Creates a new category
    /// </summary>
    /// <param name="categoryRequest">Category details</param>
    /// <returns>Created category</returns>
    /// <response code="201">Category created successfully</response>
    /// <response code="400">Invalid request data</response>
    /// <response code="500">Internal server error</response>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PostCategory([FromBody] PostCategoryRequest categoryRequest)
    {

        _logger.LogInformation("Creating a new category...");

        var newCategory = new Category
        {
            CategoryName = categoryRequest.CategoryName,
        };

        _dbContext.Categories.Add(newCategory);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Category created with ID {Id}", newCategory.CategoryID);
        var response = new
        {
            newCategory.CategoryID,
            newCategory.CategoryName
        };
        return CreatedAtAction(nameof(GetSpecificCategory), new { id = newCategory.CategoryID }, response);


    }

    /// <summary>
    /// Updates an existing category
    /// </summary>
    /// <param name="id">Category ID</param>
    /// <param name="categoryRequest">Updated data</param>
    /// <returns>Updated category</returns>
    /// <response code="200">Category updated successfully</response>
    /// <response code="400">Invalid request data</response>
    /// <response code="404">Category not found</response>
    /// <response code="500">Internal server error</response>
    [Authorize(Roles = "Admin")]
    [HttpPatch("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PatchCategory(int id, [FromBody] PatchCategoryRequest categoryRequest)
    {

        _logger.LogInformation("Updating category with ID {Id}", id);

        var existingCategory = await _dbContext.Categories.FindAsync(id);
        if (existingCategory == null)
        {
            _logger.LogWarning("Category with ID {Id} not found.", id);
            return NotFound($"Category with ID {id} not found.");
        }

        if (!string.IsNullOrEmpty(categoryRequest.CategoryName))
        {
            existingCategory.CategoryName = categoryRequest.CategoryName;
        }

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Category with ID {Id} updated successfully", id);

        return Ok(new
        {
            existingCategory.CategoryID,
            existingCategory.CategoryName,
        });
    }


    /// <summary>
    /// Deletes a category by ID
    /// </summary>
    /// <param name="id">Category ID</param>
    /// <returns>No content</returns>
    /// <response code="204">Category deleted successfully</response>
    /// <response code="404">Category not found</response>
    /// <response code="500">Internal server error</response>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteCategory(int id)
    {

        _logger.LogInformation("Deleting category with ID {Id}", id);

        var existingCategory = await _dbContext.Categories.FindAsync(id);
        if (existingCategory == null)
        {
            _logger.LogWarning("Category with ID {Id} not found.", id);
            return NotFound($"Category with ID {id} not found.");
        }

        _dbContext.Categories.Remove(existingCategory);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Category with ID {Id} deleted successfully", id);

        return NoContent();

    }
}
