using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Catalog.API.Middlewares;

public class GlobalUnhandledExceptionMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception)
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            var problemDetails = new ProblemDetails()
            {
                Status = StatusCodes.Status500InternalServerError,
                Type = "Internal Server Error",
                Detail = "Internal Server Error",
                Title = "An Error occurred while processing request. please check the request and try again.",
            };
            string json = JsonSerializer.Serialize(problemDetails);
            await context.Response.WriteAsync(json);
        }
    }
}
