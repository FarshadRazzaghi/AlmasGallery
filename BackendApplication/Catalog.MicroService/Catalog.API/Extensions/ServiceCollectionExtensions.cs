using Catalog.API.Helpers;
using Microsoft.AspNetCore.OpenApi;

namespace Catalog.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDependencies(this IServiceCollection services, IConfigurationManager configuration)
    {
        services.AddCarter();

        services.Configure<AppSettings>(configuration.GetSection("AppSettings"));
        Common.DependencyInjection.RegisterServices.Configuration(services, configuration);

        return services;
    }

    public static IServiceCollection AddCustomOpenApi(this IServiceCollection services)
    {
        services.AddOpenApi("v1",
                            options =>
                            {
                                //options.CreateSchemaReferenceId = (type) => type.Type.IsEnum ? null : OpenApiOptions.CreateDefaultSchemaReferenceId(type);
                                options.ShouldInclude = (description) => description.GroupName == null || description.GroupName == options.DocumentName;
                                options.AddDocumentTransformer<OpenApiSecuritySchemeTransformer>();
                            });
        return services;
    }

    public static IServiceCollection AddCustomAuthentication(this IServiceCollection services)
    {
        services.AddAuthentication().AddBearerToken();

        services.AddAuthorizationBuilder().AddPolicy(AuthenticationType.Authentication, p => p.AddRequirements(new AuthorizationRequirement(AuthenticationType.Authentication)));

        services.AddSingleton<IAuthorizationHandler, AuthorizationHandler>();

        return services;
    }
}
