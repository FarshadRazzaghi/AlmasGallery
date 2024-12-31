using Microsoft.Extensions.DependencyInjection;

namespace Catalog.Application.Business.UseCase;

internal partial class RegisterServices
{
    internal static void Configuration(IServiceCollection services)
    {
        services.AddScoped(typeof(IBaseUseCase<>), typeof(BaseUseCase<>));
        UseCaseConfiguration(services);
    }
}
