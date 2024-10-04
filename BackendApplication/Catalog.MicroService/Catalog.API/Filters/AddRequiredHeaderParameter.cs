using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Catalog.API.Filters;

public class AddRequiredHeaderParameter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        operation.Parameters ??= [];

        operation.Parameters.Add(new OpenApiParameter
        {
            Name = "Api-Key",
            In = ParameterLocation.Header,
            Description = "Api-Key to Authorize Request, given by provider.",
            Required = true
        });

        operation.Parameters.Add(new OpenApiParameter
        {
            Name = "Client-Id",
            In = ParameterLocation.Header,
            Description = "Client-Id to Authorize Request, given by provider.",
            Required = true
        });
    }
}