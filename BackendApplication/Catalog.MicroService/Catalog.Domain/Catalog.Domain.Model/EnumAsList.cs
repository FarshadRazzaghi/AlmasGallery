namespace Catalog.Domain.Models;

public partial class EnumAsList<T>
{
    public string Name { get; set; } = null!;
    public T? Value { get; set; }
}