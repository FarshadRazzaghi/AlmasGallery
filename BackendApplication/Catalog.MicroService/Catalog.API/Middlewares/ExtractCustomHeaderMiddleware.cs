using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using System.Text.Json;

namespace Catalog.API.Middlewares;

public class ExtractCustomHeaderMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        context.Request.Headers.TryGetValue("Api-Key", out StringValues apiKeyHeaderValue);
        context.Request.Headers.TryGetValue("Client-Id", out StringValues clientIdHeaderValue);

        if (string.IsNullOrEmpty(apiKeyHeaderValue) || string.IsNullOrEmpty(clientIdHeaderValue))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;

            var problemDetails = new ProblemDetails()
            {
                Status = StatusCodes.Status401Unauthorized,
                Type = "Unauthorized Request",
                Detail = "Unauthorized Request",
                Title = "Unauthorized Request sent, please Provide the authentication.",
            };
            string json = JsonSerializer.Serialize(problemDetails);
            await context.Response.WriteAsync(json);
        }
        else
        {
            await _next(context);
        }
    }
}
