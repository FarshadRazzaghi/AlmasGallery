using Microsoft.Extensions.DependencyInjection;

namespace Catalog.Common.DependencyInjection;

public static class RegisterServices
{
    public static void Configuration(this IServiceCollection services, string? connectionString)
    {
        Infrastructure.Persistence.RegisterServices.Configuration(services, connectionString);
        Infrastructure.Repository.RegisterServices.Configuration(services);
        Application.Business.RegisterServices.Configuration(services);
        Application.Contract.RegisterServices.Configuration(services);
    }
}
