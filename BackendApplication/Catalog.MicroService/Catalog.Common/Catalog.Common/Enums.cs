namespace Catalog.Common;

public enum EntityStatus : byte
{
    Active = 1,
    Archived = 2,
    Deleted = 3,
    Modifying = 4,
}

public enum CustomFieldGroupType : byte
{
    Product = 1,
}

public enum CustomFieldGroupLocationType : byte
{
    PageSection = 1,
    PricingSection = 2,
    DescriptionSection = 3,
}