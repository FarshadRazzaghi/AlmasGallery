using Catalog.Common.Exceptions;
using FluentValidation;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddExceptionHandler<CustomExceptionHandler>();

builder.Services.InitLogger();

try
{
    builder.Services.AddRouting(options => options.LowercaseUrls = true);
    builder.Services.AddHttpContextAccessor();

    builder.Services.AddValidatorsFromAssemblyContaining<PaginationFilterValidator>();

    builder.Services.AddCustomOpenApi();
    builder.Services.AddCustomAuthentication();

    builder.Services.AddOutputCache(options =>
    {
        options.AddBasePolicy(policy => policy.Expire(TimeSpan.FromMinutes(10)));
    });

    var connectionString = builder.Configuration.GetConnectionString("AlmasGallery");
    builder.Services.AddDependencies(builder.Configuration);

    var app = builder.Build();

    app.UseResponseCaching();

    app.UseExceptionHandler(options => { });

    //app.UseHttpsRedirection();
    app.UseSerilogRequestLogging();
    app.UseAuthorization();
    app.MapCarter();

    if (app.Environment.IsDevelopment())
    {
        app.UseCustomOpenApi();
    }

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