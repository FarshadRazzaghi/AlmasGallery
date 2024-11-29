using Carter;
using Catalog.API.Helpers;
using Catalog.Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Serilog;

namespace Catalog.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDependencies(this IServiceCollection services, IConfigurationManager configuration)
    {
        services.AddCarter();
        services.AddSerilog();

        services.Configure<AppSettings>(configuration.GetSection("AppSettings"));

        Common.DependencyInjection.RegisterServices.Configuration(services, configuration);
        return services;
    }

    public static IServiceCollection AddCustomCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAngularOrigins",
            builder =>
            {
                builder.WithOrigins("http://127.0.0.100:2525")
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });
        return services;
    }

    public static IServiceCollection AddCustomAuthentication(this IServiceCollection services)
    {
        services.AddAuthentication().AddBearerToken();
        services.AddAuthorizationBuilder().AddPolicy("Authentication", p => p.AddRequirements(new AuthorizationRequirement()));
        services.AddSingleton<IAuthorizationHandler, AuthorizationHandler>();

        return services;
    }
}
