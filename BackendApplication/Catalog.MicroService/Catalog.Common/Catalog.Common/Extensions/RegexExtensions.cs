using System.Text.RegularExpressions;

namespace AlmasGallery.Catalog.Common.Extensions;

public static partial class RegexHelper
{
    [GeneratedRegex(@"[^a-zA-Z0-9]")]
    public static partial Regex AlphabetAndNumericOnly();
}
