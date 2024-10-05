using Microsoft.CodeAnalysis;
using System.Collections.Generic;
using System.Linq;

namespace Generator.Shared;

internal static class Helper
{
    internal static INamedTypeSymbol[] GetDomainModelMembers(Compilation compilation, bool direct)
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

        return [.. domainModel.Where(m => Constants.DomainModelExcludedSymbols.Any(x => x != m.MetadataName))
                              .Where(m => !m.MetadataName.EndsWith("Mapper"))];
    }

    internal static bool IsDebugger(Compilation compilation)
    {
        return compilation.Assembly.Name.Contains("Debugger");
    }
}
