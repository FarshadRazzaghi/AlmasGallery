namespace AlmasGallery.Catalog.Application.Contract.UseCase;

/// <summary>
/// Interface for shared use cases providing common functionality across the application.
/// </summary>
public partial interface ISharedUseCase
{
    /// <summary>
    /// Retrieves a dictionary of enums grouped by category.
    /// </summary>
    /// <returns>
    /// A dictionary where the key is the category name, and the value is another dictionary
    /// containing enum names as keys and their corresponding byte values as values.
    /// </returns>
    Dictionary<string, Dictionary<string, byte>> GetEnums();
}