using System.Text.Json.Serialization;

namespace Catalog.Common;

public enum EntityStatus : byte
{
    Active = 1,
    Archived = 2,
    Deleted = 3,
    Modifying = 4,
}

public enum CustomFieldDataType : byte
{
    Number = 1,
    String = 2,
    Date = 3,
    boolean = 4,
}

public enum CustomFieldGroupEntityType : byte
{
    Product = 1,
}

public enum CustomFieldGroupLocationType : byte
{
    PageSection = 1,
    PricingSection = 2,
    DescriptionSection = 3,
}