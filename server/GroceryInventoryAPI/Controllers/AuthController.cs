using System;
using GroceryInventoryAPI.Data;
using GroceryInventoryAPI.DTOs.User;
using GroceryInventoryAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt;
using GroceryInventoryAPI.Services;

namespace GroceryInventoryAPI.Controllers;

public class AuthController : BaseController
{
    private readonly GroceryDbContext _context;
    private readonly TokenService _tokenService;
    public AuthController(GroceryDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            return BadRequest("Username already taken.");

        var user = new User
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("User registered successfully.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials.");

        var token = _tokenService.GenerateToken(user);

        return Ok(new
        {
            message = "Login successful",
            token
        });
    }

    [HttpGet("test")]
    [Authorize] // This endpoint requires a valid JWT token
    public IActionResult TestAuth()
    {
        return Ok(new
        {
            message = "JWT is working! You are authenticated.",
            timestamp = DateTime.UtcNow
        });
    }

    [HttpGet("admin-test")]
    [Authorize(Roles = "Admin")] // This endpoint requires Admin role
    public IActionResult TestAdminAuth()
    {
        return Ok(new
        {
            message = "Admin access confirmed! You have admin privileges.",
            timestamp = DateTime.UtcNow
        });
    }


}
