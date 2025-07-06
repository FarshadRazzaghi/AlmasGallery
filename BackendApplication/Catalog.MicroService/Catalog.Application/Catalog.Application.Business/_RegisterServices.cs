using Microsoft.Extensions.DependencyInjection;

namespace AlmasGallery.Catalog.Application.Business.UseCase;

internal partial class RegisterServices
{
    internal static void Configuration(IServiceCollection services)
    {
        services.AddScoped(typeof(IBaseUseCase<>), typeof(BaseUseCase<>));
        services.AddScoped<ISharedUseCase, SharedUseCase>();

        UseCaseConfiguration(services);
    }
}
