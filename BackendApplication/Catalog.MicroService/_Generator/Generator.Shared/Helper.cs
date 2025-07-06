#nullable disable

using Microsoft.CodeAnalysis;
using System.Collections.Generic;
using System.Linq;

namespace Generator.Shared;

internal static class Helper
{
    internal static INamedTypeSymbol[] GetDomainModelMembers(Compilation compilation, bool direct, bool dataBaseObjectsOnly)
    {
        INamespaceSymbol symbol = null;
        if (direct && !IsDebugger(compilation))
        {
            var domainModelSymbol = compilation.SourceModule;

            if (domainModelSymbol is null)
            {
                return [];
            }
            symbol = domainModelSymbol.GlobalNamespace;
        }
        else
        {
            var domainModelSymbol = compilation.SourceModule
                                               .ReferencedAssemblySymbols
                                               .First(q => q.Name == Constants.DomainModelLibraryName);

            if (domainModelSymbol is null)
            {
                return [];
            }
            symbol = domainModelSymbol.GlobalNamespace;
        }

        var domainModelNameSpaces = Constants.DomainModelNamespaces;
        var domainModel = new List<INamedTypeSymbol>();
        for (int i = 0; i < domainModelNameSpaces.Length; i++)
        {
            var spicedNameSpaces = domainModelNameSpaces[i].Split('.');
            for (int j = 0; j < spicedNameSpaces.Length; j++)
            {
                symbol = symbol.GetNamespaceMembers().FirstOrDefault(s => s.Name == spicedNameSpaces[j]);
                if (symbol == null)
                {
                    break;
                }
            }

            if (symbol != null)
            {
                domainModel.AddRange(symbol.GetTypeMembers());
            }
        }

        var allModels = domainModel.Where(m => Constants.DomainModelExcludedSymbols.Any(x => x != m.MetadataName))
                                   .Where(m => !m.MetadataName.EndsWith("Mapper"))
                                   .OrderBy(m => m.MetadataName);

        if (dataBaseObjectsOnly)
        {
            return [.. allModels.Where(x => x.Interfaces.Length > 0).Where(x => x.Interfaces.Any(x => x.Name.Equals(Constants.BaseEntityInterfaceName)))];
        }

        return [.. allModels];
    }

    internal static bool IsDebugger(Compilation compilation)
    {
        return compilation.Assembly.Name.Contains("Debugger");
    }
}
