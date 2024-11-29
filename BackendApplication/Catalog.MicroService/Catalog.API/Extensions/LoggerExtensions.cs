using Serilog;
using Serilog.Events;
using Serilog.Templates.Themes;
using SerilogTracing;
using SerilogTracing.Expressions;

namespace Catalog.API.Extensions;

public static class LoggerExtensions
{
    public static void InitLogger()
    {
        Log.Logger = new LoggerConfiguration()
                       .Enrich.FromLogContext()
                       .Enrich.WithProperty("Application", "Almas Gallery")
                       .MinimumLevel.Information()
                       .MinimumLevel.Override("Microsoft.AspNetCore.Hosting", LogEventLevel.Warning)
                       .MinimumLevel.Override("Microsoft.AspNetCore.Routing", LogEventLevel.Warning)
                       .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
                       .WriteTo.Console(Formatters.CreateConsoleTextFormatter(theme: TemplateTheme.Literate))
                       .WriteTo.Seq(serverUrl: "http://127.0.0.100:5341", apiKey: "ZBTFmIjzeijozv5GlIES")
                       .CreateLogger();

        using var listener = new ActivityListenerConfiguration()
                           .Instrument.AspNetCoreRequests()
                           .TraceToSharedLogger();
    }
}
