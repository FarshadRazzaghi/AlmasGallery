using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Catalog.Infrastructure;

internal static class RegisterServices
{
    public static void Configuration(IServiceCollection services, string? connectionString)
    {
        ArgumentNullException.ThrowIfNull(connectionString);

        services.AddDbContext<AlmasGalleryContext>(options => options.UseSqlServer(connectionString, x => x.UseNetTopologySuite()));
        services.AddScoped<DbContext, AlmasGalleryContext>();
    }
}
