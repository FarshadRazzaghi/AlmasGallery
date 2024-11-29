using Carter;
using Catalog.Application.Contract.UseCase;
using Catalog.Application.Models;
using Catalog.Domain.Models;

namespace Catalog.API.Endpoints;

public class CustomFieldGroupEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var map = app.MapGroup("api/v2/custom-field-group");

        map.MapGet("get",
                  async (ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!) =>
                  {
                      return TypedResults.Ok(await customFieldGroupService.GetListAsync(cancellation));
                  })
           .WithGroupName("CustomFieldGroup")
           .WithName("CustomFieldGroupGetList")
           .WithDescription("Returns list of all customFieldGroups")
           .Produces<Product[]>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status500InternalServerError)
           .RequireAuthorization("Authentication");

        map.MapGet("get/{id}",
                  async (long id, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!) =>
                  {
                      var customField = await customFieldGroupService.GetByIdAsync(id, cancellation);
                      return customField != null ? TypedResults.Ok(customField) : Results.NotFound();
                  })
           .WithGroupName("CustomFieldGroup")
           .WithName("CustomFieldGroupGetById")
           .WithDescription("Returns single customFieldGroup by given Id")
           .Produces<CustomFieldGroup>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status500InternalServerError)
           .RequireAuthorization("Authentication");

        map.MapGet("get-types-list",
                  async (ICustomFieldGroupUseCase customFieldGroupService) =>
                  {
                      return await Task.FromResult(TypedResults.Ok(customFieldGroupService.GetListOfAvailableTypes()));
                  })
           .WithGroupName("CustomFieldGroup")
           .WithName("GetCustomFieldGroupTypesList")
           .WithDescription("Returns a customFieldGroup Type to use in Dropdown")
           .Produces<EnumAsList<byte>[]>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status500InternalServerError)
           .RequireAuthorization("Authentication");

        map.MapPost("create",
                   async (CustomFieldGroupDto customFieldGroup, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!) =>
                   {
                       if (customFieldGroup == null)
                       {
                           return Results.BadRequest();
                       }

                       var insertedModel = await customFieldGroupService.CreateAsync(customFieldGroup, cancellation);
                       return Results.CreatedAtRoute("GetById", new { id = insertedModel.Id }, insertedModel);
                   })
           .WithGroupName("CustomFieldGroup")
           .WithName("CreateCustomField")
           .WithDescription("Creates new CustomFieldGroup")
           .Produces<CustomFieldGroup>(StatusCodes.Status201Created)
           .Produces(StatusCodes.Status400BadRequest)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status500InternalServerError)
           .RequireAuthorization("Authentication");
    }
}