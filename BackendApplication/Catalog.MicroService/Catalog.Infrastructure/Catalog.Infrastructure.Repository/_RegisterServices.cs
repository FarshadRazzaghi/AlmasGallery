using Microsoft.Extensions.DependencyInjection;

namespace Catalog.Infrastructure.Repository;

internal partial class RegisterServices
{
    internal static void Configuration(IServiceCollection services)
    {
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));

        RepositoryConfiguration(services);
    }
}