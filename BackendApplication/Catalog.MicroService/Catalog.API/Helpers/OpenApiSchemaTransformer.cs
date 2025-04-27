using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;

namespace Catalog.API.Helpers;

public class OpenApiSchemaTransformer : IOpenApiSchemaTransformer
{
    public Task TransformAsync(OpenApiSchema schema, OpenApiSchemaTransformerContext context, CancellationToken cancellationToken)
    {
        var type = context.JsonTypeInfo.Type;
        if (type.IsEnum)
        {
            schema.Format = "int32";
            //schema.Properties = new Dictionary<string, OpenApiSchema>
            //{
            //    ["name"] = new OpenApiSchema { Type = "string" },
            //    ["value"] = new OpenApiSchema { Type = "integer", Format = "int32" }
            //};

            schema.Enum = [.. Enum.GetValues(type)
                                  .Cast<object>()
                                  .Select(enumValue => new OpenApiObject
                                  {
                                      ["name"] = new OpenApiString(enumValue.ToString()),
                                      ["value"] = new OpenApiInteger(Convert.ToInt32(enumValue))
                                  })
                                  .Cast<IOpenApiAny>()];
        }

        return Task.CompletedTask;
    }
}
