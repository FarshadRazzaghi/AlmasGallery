using Catalog.API.Helpers.Filters;

namespace Catalog.API.Extensions;

public static class EndpointRouteExtensions
{
    public static RouteHandlerBuilder RequiredValidation(this RouteHandlerBuilder routeHandlerBuilder)
    {
        routeHandlerBuilder.AddEndpointFilter<EndpointValidationFilter>();
        return routeHandlerBuilder;
    }

    public static RouteGroupBuilder RequiredValidation(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.AddEndpointFilter<EndpointValidationFilter>();
        return routeGroupBuilder;
    }
}
