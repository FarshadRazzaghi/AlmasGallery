namespace Catalog.Application.Models;

/// <summary>
/// Represents application settings.
/// </summary>
public class AppSettings
{
    /// <summary>
    /// Gets or sets the secret key used for authentication.
    /// </summary>
    public string Secret { get; set; } = string.Empty;
}
