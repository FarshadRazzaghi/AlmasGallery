using FluentValidation;
using FluentValidation.AspNetCore;
using FluentValidation.Results;

namespace Catalog.API.Helpers.Filters;

public class EndpointValidationFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var serviceProvider = context.HttpContext.RequestServices;
        var errors = new List<ValidationFailure>();

        foreach (var argument in context.Arguments)
        {
            if (argument == null)
            {
                continue;
            }

            errors.AddRange(await CascadingValidate(serviceProvider, argument, argument.GetType(), context.HttpContext.RequestAborted));
        }

        if (errors.Count > 0)
        {
            throw new ValidationException(errors);
        }

        return await next.Invoke(context);
    }

    private static async Task<ValidationFailure[]> CascadingValidate(IServiceProvider serviceProvider, object argument, Type argumentType, CancellationToken cancellationToken = default!)
    {
        var errors = new List<ValidationFailure>();
        errors.AddRange(await Validate(serviceProvider, argument, argumentType, cancellationToken));

        if (argumentType.BaseType != null)
        {
            errors.AddRange(await CascadingValidate(serviceProvider, argument, argumentType.BaseType, cancellationToken));
        }

        return [.. errors];
    }

    private static async Task<ValidationFailure[]> Validate(IServiceProvider serviceProvider, object argument, Type argumentType, CancellationToken cancellationToken = default!)
    {
        var errors = new List<ValidationFailure>();
        if (IsCustomType(argumentType) && GetValidator(serviceProvider, argumentType) is IValidator validator)
        {
            var validationContext = new ValidationContext<object>(argument);

            var validationResult = await validator.ValidateAsync(validationContext, cancellationToken);
            var failures = validationResult.Errors.ToList();
            if (failures.Count != 0)
            {
                errors.AddRange(failures);
            }
        }

        return [.. errors];
    }

    public static object? GetValidator(IServiceProvider serviceProvider, Type type)
    {
        return serviceProvider.GetService(typeof(IValidator<>).MakeGenericType(type));
    }

    public static bool IsCustomType(Type? type)
    {
        Type[] source =
        [
            typeof(string),
            typeof(decimal),
            typeof(DateTime),
            typeof(DateTimeOffset),
            typeof(TimeSpan),
            typeof(Guid)
        ];
        if (type != null && type.IsClass && !type.IsEnum && !type.IsValueType && !type.IsPrimitive)
        {
            return !source.Contains(type);
        }

        return false;
    }
}
