using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;

namespace Catalog.Infrastructure.Persistence;

internal static class RegisterServices
{
    public static void Configuration(IServiceCollection services, string? connectionString)
    {
        ArgumentNullException.ThrowIfNull(connectionString);

        services.AddDbContext<AlmasGalleryContext>(options =>
        {
            options.UseSqlServer(connectionString);

            options.LogTo((message) => Debug.Write(message),
                        Microsoft.Extensions.Logging.LogLevel.Information,
                        DbContextLoggerOptions.SingleLine);

            options.EnableDetailedErrors();
        });

        services.AddScoped<DbContext, AlmasGalleryContext>();
    }
}
