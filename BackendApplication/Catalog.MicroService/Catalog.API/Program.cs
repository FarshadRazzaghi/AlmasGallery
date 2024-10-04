var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Version = "v1",
        Title = "Catalog API",
        Description = "An ASP.NET Core Web API for managing Product and related Objects.",
    });

    var xmlFilename = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

    options.OperationFilter<Catalog.API.Filters.AddRequiredHeaderParameter>();
});

builder.Services.AddRouting(options => options.LowercaseUrls = true);

var connectionString = builder.Configuration.GetValue<string>("DatabaseSettings:ConnectionString");
Catalog.Common.DependencyInjection.RegisterServices.Configuration(builder.Services, connectionString);

builder.Services.AddLogging();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseWhen(context => context.Request.Path.StartsWithSegments("/api"),
            options =>
            {
                options.UseMiddleware<Catalog.API.Middlewares.ExtractCustomHeaderMiddleware>();
            });

app.UseMiddleware<Catalog.API.Middlewares.GlobalUnhandledExceptionMiddleware>();

app.UseAuthorization();
app.MapControllers();

app.Run();
