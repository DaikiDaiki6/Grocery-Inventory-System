using System.ComponentModel.DataAnnotations;

namespace GroceryInventoryAPI.DTOs.User;

public class LoginRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
} 