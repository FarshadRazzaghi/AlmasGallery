using Catalog.Common.Exceptions;
using FluentValidation;
using Serilog;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddExceptionHandler<CustomExceptionHandler>();

builder.Services.InitLogger();

try
{
    builder.Services.AddRouting(options => options.LowercaseUrls = true);
    builder.Services.AddHttpContextAccessor();

    builder.Services.AddControllers()
                    .AddJsonOptions(x =>
                    {
                        x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
                        x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    });

    builder.Services.AddValidatorsFromAssemblyContaining<PaginationFilterValidator>();

    builder.Services.AddCustomAuthentication();
    builder.Services.AddCustomCors();

    var connectionString = builder.Configuration.GetConnectionString("AlmasGallery");
    builder.Services.AddDependencies(builder.Configuration);

    var app = builder.Build();

    app.UseResponseCaching();

    app.UseExceptionHandler(options => { });

    app.UseHttpsRedirection();
    app.UseSerilogRequestLogging();
    app.UseAuthorization();
    app.UseCustomCors();

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