using System.Data;
using System.Reflection;

namespace Catalog.Application.Business.UseCase;

/// <summary>
/// Shared use case class providing common functionality across the application.
/// </summary>
internal partial class SharedUseCase() : ISharedUseCase
{
    /// <summary>
    /// An array of valid namespaces to filter project types.
    /// </summary>
    private readonly string[] ValidNamespaces = ["Catalog.Common", "Catalog.Application.Models"];

    /// <inheritdoc />
    public Dictionary<string, Dictionary<string, byte>> GetEnums()
    {
        var toRet = new Dictionary<string, Dictionary<string, byte>>();
        var enumTypes = GetProjectTypes().Where(t => t.IsEnum).ToArray();

        for (int i = 0; i < enumTypes.Length; i++)
        {
            var enumValues = Enum.GetValues(enumTypes[i])
                                 .Cast<Enum>()
                                 .ToDictionary(x => x.ToString(), x => Convert.ToByte(x));

            toRet.Add(enumTypes[i].Name, enumValues);
        }

        return toRet;
    }

    /// <summary>
    /// Retrieves all types from the assemblies in the current application domain
    /// that belong to the specified valid namespaces.
    /// </summary>
    /// <returns>An array of types from the valid namespaces.</returns>
    private Type[] GetProjectTypes()
        => AppDomain.CurrentDomain.GetAssemblies()
                                  .Where(assembly => !string.IsNullOrEmpty(assembly.FullName) && ValidNamespaces.Any(ns => assembly.FullName.Contains(ns)))
                                  .SelectMany(x => x.GetTypes())
                                  .ToArray();
}