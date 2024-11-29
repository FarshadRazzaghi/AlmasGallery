using Catalog.Domain.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Catalog.Common.DependencyInjection;

public static class RegisterServices
{
    public static void Configuration(this IServiceCollection services, IConfigurationManager configuration, string? connectionString)
    {
        Infrastructure.Persistence.RegisterServices.Configuration(services, connectionString);
        Infrastructure.Repository.RegisterServices.Configuration(services);

        Application.Business.UseCase.RegisterServices.Configuration(services);

        services.Configure<AppSettings>(configuration.GetSection("AppSettings"));
    }
}
