namespace AlmasGallery.Catalog.Common;

/// <summary>
/// Represents the status of an entity.
/// </summary>
public enum EntityStatus : byte
{
    Active = 1,
    Archived = 2,
    Deleted = 3,
    Modifying = 4,
}

/// <summary>
/// Represents the data type of a custom field.
/// </summary>
public enum CustomFieldDataType : byte
{
    Number = 1,
    String = 2,
    Date = 3,
    Boolean = 4,
}

/// <summary>
/// Represents the entity type of a custom field group.
/// </summary>
public enum CustomFieldGroupEntityType : byte
{
    Product = 1,
}

/// <summary>
/// Represents the location type of a custom field group.
/// </summary>
public enum CustomFieldGroupLocationType : byte
{
    PageSection = 1,
    PricingSection = 2,
    DescriptionSection = 3,
}