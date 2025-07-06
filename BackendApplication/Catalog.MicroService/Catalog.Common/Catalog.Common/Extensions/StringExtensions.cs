using System.Globalization;

namespace Catalog.Common.Extensions;

public static partial class StringExtensions
{
    public static string ToCamelCase(this string input)
    {
        if (string.IsNullOrEmpty(input))
        {
            return input;
        }

        TextInfo textInfo = CultureInfo.InvariantCulture.TextInfo;
        string titleCase = textInfo.ToTitleCase(input.ToLower());

        titleCase = RegexHelper.AlphabetAndNumericOnly().Replace(titleCase, " ");

        string camelCase = char.ToLower(titleCase[0]) + titleCase[1..].Replace(" ", "");

        return camelCase;
    }

    public static string LowercaseFirstChar(this string input)
    {
        if (!string.IsNullOrEmpty(input))
        {
            return char.ToLower(input[0]) + input[1..];
        }
        return input;
    }
}
