using Carter;
using Catalog.API.Helper;
using Microsoft.AspNetCore.Authorization;
using Serilog;
using Serilog.Events;
using Serilog.Templates.Themes;
using SerilogTracing;
using SerilogTracing.Expressions;

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

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddRouting(options => options.LowercaseUrls = true);
    builder.Services.AddHttpContextAccessor();

    builder.Services.AddAuthentication().AddBearerToken();
    builder.Services.AddAuthorizationBuilder().AddPolicy("Authentication", p => p.AddRequirements(new AuthorizationRequirement()));
    builder.Services.AddSingleton<IAuthorizationHandler, AuthorizationHandler>();

    builder.Services.AddCarter();
    builder.Services.AddSerilog();

    var connectionString = builder.Configuration.GetConnectionString("AlmasGallery");
    Catalog.Common.DependencyInjection.RegisterServices.Configuration(builder.Services, builder.Configuration, connectionString);

    var app = builder.Build();

    app.UseHttpsRedirection();
    app.UseSerilogRequestLogging();
    app.MapCarter();

    await app.RunAsync();
    return 0;
}
catch (Exception ex)
{
    Log.Fatal(ex, "Unhandled exception");
    return 1;
}
finally
{
    await Log.CloseAndFlushAsync();
}