using System;
using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace GroceryInventoryAPI.MiddleWare;

public class ExceptionMiddleWare
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleWare> _logger;

    public ExceptionMiddleWare(RequestDelegate next, ILogger<ExceptionMiddleWare> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occured: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = new
        {
            message = "An error occured",
            details = (string?)null
        };

        switch (exception)
        {
            case DbUpdateException dbEx when dbEx.InnerException is PostgresException pgEx:
                var (statusCode, message) = HandlePostgresException(pgEx);
                context.Response.StatusCode = statusCode;
                response = new { message, details = (string?)null };
                break;
            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response = new { message = "An internal server error occured", details = (string?)null };
                break;
        }

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }

    private static (int statusCode, string message) HandlePostgresException(PostgresException pgEx)
    {
        return pgEx.SqlState switch
        {
            "23503" => HandleForeignKeyViolation(pgEx),
            "23505" => HandleUniqueConstraintViolation(pgEx),
            "23502" => (400, "Required field cannot be null"),
            _ => (500, "A database error occured")
        };
    }

    private static (int statusCode, string message) HandleForeignKeyViolation(PostgresException pgEx)
    {
        var constraintName = pgEx.ConstraintName ?? "";

        var message = constraintName switch
        {
            "FK_Inventories_Products_ProductID" => "Product not found. Please provide a valid Product ID",
            "FK_Inventories_Warehouses_WarehouseID" => "Warehouse not found. Please provide a valid Warehouse ID.",
            "FK_Products_Categories_CategoryID" => "Category not found. Please provide a valid Category ID.",
            "FK_Products_Suppliers_SupplierID" => "Supplier not found. Please provide a valid Supplier ID.",
            _ => "Referenced record not found. Please check your foreign key values."
        };
        return (400, message);
    }

    private static (int statusCode, string message) HandleUniqueConstraintViolation(PostgresException pgEx)
    {
        var constraintName = pgEx.ConstraintName ?? "";
        var message = constraintName switch
        {
            "PK_Products" => "Product with this ID already exists. Please use a different Product ID.",
            "PK_Categories" => "Category with this ID already exists. Please use a different Category ID.",
            "PK_Suppliers" => "Supplier with this ID already exists. Please use a different Supplier ID.",
            "PK_Warehouses" => "Warehouse with this ID already exists. Please use a different Warehouse ID.",
            "PK_Inventories" => "Inventory record with this ID already exists.",
            _ => "Record already exists. Please use different values."
        };
        return (409, message);
    }
}
