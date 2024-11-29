using Carter;
using Catalog.API.Extensions;
using Serilog;

Catalog.API.Extensions.LoggerExtensions.InitLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);
    builder.Services.AddRouting(options => options.LowercaseUrls = true);
    builder.Services.AddHttpContextAccessor();

    builder.Services.AddCustomCors();
    builder.Services.AddCustomAuthentication();

    var connectionString = builder.Configuration.GetConnectionString("AlmasGallery");
    builder.Services.AddDependencies(builder.Configuration);

    var app = builder.Build();
    app.UseHttpsRedirection();
    app.UseCustomCors();

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