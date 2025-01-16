using Catalog.Common;
using System.Data;

namespace Catalog.Application.Business.UseCase;

internal partial class SharedUseCase : ISharedUseCase
{
    public Dictionary<string, EnumAsList<byte>[]> GetEnumsAsList()
    {
        var toRet = new Dictionary<string, EnumAsList<byte>[]>();

        var customFieldGroupTypes = Enum.GetValues(typeof(CustomFieldGroupType))
                                        .Cast<CustomFieldGroupType>()
                                        .Select(x => new EnumAsList<byte>
                                        {
                                            Name = x.ToString(),
                                            Value = (byte)x
                                        })
                                        .ToArray();
        toRet.Add(nameof(CustomFieldGroupType), customFieldGroupTypes);

        var customFieldGroupLocationTypes = Enum.GetValues(typeof(CustomFieldGroupLocationType))
                                                .Cast<CustomFieldGroupLocationType>()
                                                .Select(x => new EnumAsList<byte>
                                                {
                                                    Name = x.ToString(),
                                                    Value = (byte)x
                                                })
                                                .ToArray();
        toRet.Add(nameof(CustomFieldGroupLocationType), customFieldGroupLocationTypes);

        return toRet;
    }
}