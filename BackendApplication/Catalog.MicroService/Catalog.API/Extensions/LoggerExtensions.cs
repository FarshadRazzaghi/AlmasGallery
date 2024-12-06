using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;

namespace Catalog.API.Extensions;

public static class LoggerExtensions
{
    public static IServiceCollection InitLogger(this IServiceCollection services)
    {
        Log.Logger = new LoggerConfiguration()
                     .Enrich.FromLogContext()
                     .Enrich.WithProperty("Application", "Almas Gallery")
                     .MinimumLevel.Information()
                     .MinimumLevel.Override("Microsoft.AspNetCore.Hosting", LogEventLevel.Warning)
                     .MinimumLevel.Override("Microsoft.AspNetCore.Routing", LogEventLevel.Warning)
                     .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
                     .WriteTo.Console(theme: AnsiConsoleTheme.Literate)
                     .WriteTo.Seq(serverUrl: "http://127.0.0.100:5341", apiKey: "ZBTFmIjzeijozv5GlIES")
                     .CreateLogger();

        services.AddSerilog();
        return services;
    }
}
