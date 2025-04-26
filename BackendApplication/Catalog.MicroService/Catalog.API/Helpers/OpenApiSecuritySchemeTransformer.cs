using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;

namespace Catalog.API.Helpers;

public class OpenApiSecuritySchemeTransformer : IOpenApiDocumentTransformer
{
    public Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
    {
        document.Info.Title = "Almas Gallery API reference";
        document.Info.Description = "API endpoints for Almas Gallery";
        document.Info.Contact = new OpenApiContact
        {
            Name = "Farshad Razzaghi",
            Email = "f.razaghi22@gmail.com",
            Url = new Uri("https://github.com/FarshadRazzaghi")
        };

        document.Servers.Add(new OpenApiServer() { Url = "https://127.0.0.100:5050/" });

        var securitySchema = new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "basic",
            BearerFormat = "Username:Password",
            Description = "JWT Authorization header using the basic scheme."
        };

        var securityRequirement = new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Id = "Authentication",
                        Type = ReferenceType.SecurityScheme
                    }
                },[]
            }
        };

        document.SecurityRequirements.Add(securityRequirement);
        document.Components = new OpenApiComponents()
        {
            SecuritySchemes = new Dictionary<string, OpenApiSecurityScheme>() { { "Authentication", securitySchema } },
            Headers = new Dictionary<string, OpenApiHeader> { { "Authorization", new OpenApiHeader { Required = true } } }
        };

        return Task.CompletedTask;
    }
}
