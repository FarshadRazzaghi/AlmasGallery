namespace Catalog.Application.Models;

/// <summary>
/// Represents application settings.
/// This class is used to configure and manage application-level settings, such as authentication secrets.
/// </summary>
public class AppSettings
{
    /// <summary>
    /// Gets or sets the secret key used for authentication.
    /// This key should be kept secure and not exposed publicly.
    /// </summary>
    public string Secret { get; set; } = string.Empty;
}
