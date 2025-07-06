namespace AlmasGallery.Catalog.API.Endpoints;

public class SharedEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var map = app.MapGroup("api/v2")
                     .WithGroupName("Shared")
                     .RequireAuthorization(AuthenticationType.Authentication)
                     .RequiredValidation();

        map.MapGet("/enums", GetListEnumsAsync)
           .WithName("GetEnumsAsList")
           .WithDescription("Returns a dictionary of enum types and their values.")
           .Produces<Dictionary<string, Dictionary<string, byte>>>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status500InternalServerError);

        static async Task<IResult> GetListEnumsAsync(ISharedUseCase sharedService)
        {
            return await Task.FromResult(TypedResults.Ok(sharedService.GetEnums()));
        }
    }
}