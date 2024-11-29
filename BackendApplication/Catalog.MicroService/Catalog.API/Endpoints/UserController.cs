using Carter;
using Catalog.Application.Contract.UseCase;
using Catalog.Domain.Model.Authentication;

namespace Catalog.API.Endpoints;

public class UserController : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var map = app.MapGroup("api/v2/user");

        map.MapPost("authenticate",
                   async (AuthenticateRequest model, IUserUseCase userUseCase, CancellationToken cancellationToken = default!) =>
                   {
                       var response = await userUseCase.AuthenticateAsync(model, cancellationToken);
                       return response != null ? TypedResults.Ok(response.Token) : Results.BadRequest();
                   })
           .WithGroupName("User")
           .WithName("UserAuthenticate")
           .WithDescription("Login User to server to use as claim token")
           .Produces<string>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status400BadRequest)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status500InternalServerError);
    }
}