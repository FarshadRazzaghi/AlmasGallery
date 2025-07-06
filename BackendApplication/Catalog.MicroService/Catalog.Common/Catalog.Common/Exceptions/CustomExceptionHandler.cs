using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AlmasGallery.Catalog.Common.Exceptions;

public class CustomExceptionHandler(ILogger<CustomExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        logger.LogError("Error Message: \r\n{exceptionMessage}", exception.Message);

        (string Detail, string Title, int StatusCode) = exception switch
        {
            UnauthorizedAccessException => (exception.Message, exception.GetType().Name, context.Response.StatusCode = StatusCodes.Status401Unauthorized),
            ValidationException => (exception.Message, exception.GetType().Name, context.Response.StatusCode = StatusCodes.Status400BadRequest),
            RelationException => (exception.Message, exception.GetType().Name, context.Response.StatusCode = StatusCodes.Status500InternalServerError),
            _ => (exception.Message, exception.GetType().Name, context.Response.StatusCode = StatusCodes.Status500InternalServerError),
        };

        var problemDetails = new ProblemDetails()
        {
            Detail = Detail,
            Title = Title,
            Status = StatusCode,
            Instance = context.Request.Path
        };

        if (exception is ValidationException validationException)
        {
            problemDetails.Extensions.Add("validationErrors", validationException.Errors.Select(x => new
            {
                x.PropertyName,
                x.ErrorMessage,
                x.AttemptedValue,
                x.CustomState,
                x.Severity,
                x.ErrorCode,
            }));
        }

        if (exception is RelationException relationException)
        {
            problemDetails.Extensions.Add("relationMessage", relationException.RelationMessage);
        }

        problemDetails.Extensions.Add("traceId", context.TraceIdentifier);

        await context.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }
}
