using Catalog.Common.Extensions;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using System.Xml.Linq;

namespace Catalog.API.Helpers;

public class OpenApiSchemaTransformer : IOpenApiSchemaTransformer
{
    public Task TransformAsync(OpenApiSchema schema, OpenApiSchemaTransformerContext context, CancellationToken cancellationToken)
    {
        var type = context.JsonTypeInfo.Type;
        if (type.IsEnum)
        {
            schema.Format = Enum.GetUnderlyingType(type).Name.ToCamelCase();

            schema.Enum = [.. Enum.GetValues(type)
                                  .Cast<object>()
                                  .Select(enumValue => new OpenApiInteger(Convert.ToInt32(enumValue)))
                                  .Cast<IOpenApiAny>()];

            var enumDescriptions = new OpenApiObject();
            foreach (var enumValue in Enum.GetValues(type))
            {
                enumDescriptions.Add(Convert.ToInt32(enumValue).ToString(), new OpenApiString($"{enumValue}"));
            }

            schema.Extensions["x-enumDescriptions"] = enumDescriptions;
        }

        return Task.CompletedTask;
    }
}
