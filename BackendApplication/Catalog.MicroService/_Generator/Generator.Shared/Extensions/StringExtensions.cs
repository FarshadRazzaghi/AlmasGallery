namespace Generator.Shared.Extensions;

internal static class StringExtensions
{
    internal static string ToRepository(this string className, bool isInterface = false)
        => $"{(isInterface ? "I" : "")}{className.Pascalize()}{Constants.RepositoryPostfix}";

    internal static string ToUseCase(this string className, bool isInterface = false)
        => $"{(isInterface ? "I" : "")}{className.Pascalize()}{Constants.UseCasePostfix}";

    internal static string ToBaseRepository(this string className, bool isInterface = false)
        => $"{(isInterface ? "I" : "")}{Constants.BaseRepositoryClassName}<{className.Pascalize()}>";

    internal static string ToBaseUseCase(this string className, bool isInterface = false)
        => $"{(isInterface ? "I" : "")}{Constants.BaseUseCaseClassName}<{className.Pascalize()}>";

    internal static string AsParameter(this string className, bool field = false)
        => $"{className} {(field ? className.Field() : className.Parameter())}";

    internal static string Parameter(this string className)
        => $"{className.ToClassName().Camelize()}";

    internal static string Field(this string className)
        => $"{className.ToClassName().Camelize().UnderScored()}";

    internal static string ToClassName(this string interfaceName)
        => interfaceName.StartsWith("I") ? interfaceName.Substring(1) : interfaceName;

    internal static string Pascalize(this string value)
        => value.Substring(0, 1).ToUpper() + value.Substring(1);

    public static string Camelize(this string value)
        => value.Substring(0, 1).ToLower() + value.Substring(1);

    public static string UnderScored(this string value)
        => $"_{value.Camelize()}";

    public static string TabIndent(this string value, int tabCount = 0)
    {
        var toRet = string.Empty;
        for (int i = 0; i < tabCount; i++)
        {
            toRet += "    ";
        }

        return toRet + value;
    }
}
