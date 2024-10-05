using Catalog.Application.Business.UseCase;
using Microsoft.Extensions.DependencyInjection;

namespace Catalog.Application.Business;

internal static class RegisterServices
{
    public static void Configuration(IServiceCollection services)
    {
        services.AddScoped(typeof(IBaseUseCase<>), typeof(BaseUseCase<>));

        services.AddScoped<IProductUseCase, ProductUseCase>();
    }
}
