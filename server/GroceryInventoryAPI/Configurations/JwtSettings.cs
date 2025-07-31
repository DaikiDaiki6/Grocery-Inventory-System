using System;

namespace GroceryInventoryAPI.Configurations;

public class JwtSettings
{
    public string SecretKey { get; set; } = string.Empty;
    public string Issuer { get; set; } = "GroceryAPI";
    public string Audience { get; set; } = "GroceryUsers";
    public int ExpiryMinutes { get; set; } = 60;
}
