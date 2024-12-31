namespace Catalog.API.Extensions;

public static class ApplicationExtensions
{
    public static WebApplication UseCustomCors(this WebApplication application)
    {
        application.UseCors("AllowAngularOrigins");
        return application;
    }
}
