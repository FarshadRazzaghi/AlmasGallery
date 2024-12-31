namespace Catalog.Application.Models.Filters;

public class CustomFieldGroupFilter : PaginationFilter
{
    public byte? GroupType { get; set; }
    public string? GroupName { get; set; }
}