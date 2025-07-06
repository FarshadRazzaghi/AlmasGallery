using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;

namespace AlmasGallery.Catalog.Infrastructure.Persistence;

internal static class RegisterServices
{
    public static void Configuration(IServiceCollection services, string? connectionString)
    {
        ArgumentNullException.ThrowIfNull(connectionString);

        services.AddDbContext<AlmasGalleryDbContext>(options =>
        {
            options.UseSqlServer(connectionString);
            options.LogTo((message) => Debug.Write(message),
                        Microsoft.Extensions.Logging.LogLevel.Information,
                        DbContextLoggerOptions.SingleLine);

            options.EnableDetailedErrors();
            options.EnableSensitiveDataLogging();
        });

        services.AddScoped<DbContext, AlmasGalleryDbContext>();
    }
}
