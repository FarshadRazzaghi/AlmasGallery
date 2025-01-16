namespace Catalog.Application.Contract.UseCase;

public partial interface ISharedUseCase
{
    Dictionary<string, EnumAsList<byte>[]> GetEnumsAsList();
}