using Scalar.AspNetCore;

namespace AlmasGallery.Catalog.API.Extensions;

public static class ApplicationExtensions
{
    public static WebApplication UseCustomOpenApi(this WebApplication app)
    {
        var openApiUrl = "/openapi/v1.json";
        app.MapOpenApi().CacheOutput().AllowAnonymous();

        app.MapScalarApiReference(options =>
        {
            options.WithOpenApiRoutePattern(openApiUrl);
            options.Theme = ScalarTheme.DeepSpace;
            options.Authentication = new ScalarAuthenticationOptions
            {
                PreferredSecurityScheme = "Authentication"
            };
        }).AllowAnonymous();

        return app;
    }
}
