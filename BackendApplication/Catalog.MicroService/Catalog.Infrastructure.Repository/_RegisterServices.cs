using Catalog.Application.Contract.Repository;
using Microsoft.Extensions.DependencyInjection;

namespace Catalog.Infrastructure.Repository;

internal static class RegisterServices
{
    public static void Configuration(IServiceCollection services)
    {
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));

        services.AddScoped<IProductRepository, ProductRepository>();
    }
}
