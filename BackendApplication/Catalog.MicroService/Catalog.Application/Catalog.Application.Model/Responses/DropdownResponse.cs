namespace AlmasGallery.Catalog.Application.Models.Responses;

/// <summary>
/// Represents a response object for a dropdown item.
/// </summary>
public class DropdownResponse
{
    /// <summary>
    /// Gets or sets the key of the dropdown item.
    /// </summary>
    public long Key { get; set; }

    /// <summary>
    /// Gets or sets the value of the dropdown item.
    /// </summary>
    public string Value { get; set; } = null!;
}