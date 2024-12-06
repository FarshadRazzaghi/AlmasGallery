namespace Catalog.API.Endpoints;

public class CustomFieldGroupEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var map = app.MapGroup("api/v2/custom-field-group")
                     .WithGroupName("CustomFieldGroup")
                     .RequireAuthorization(AuthenticationType.Authentication)
                     .RequiredValidation();

        map.MapGet("list",
                  async ([AsParameters] CustomFieldGroupFilter filter, HttpContext httpContext, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!) =>
                  {
                      var (list, totalCount) = await customFieldGroupService.GetListIncludingCustomFieldsAsync(filter, cancellation);
                      httpContext.Response.Headers.Append("X-Total-Count", totalCount.ToString());
                      return Results.Ok(AsObjectResult(list));
                  })
           .WithName("CustomFieldGroupGetList")
           .WithDescription("Returns list of all customFieldGroups")
           .Produces<object[]>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status500InternalServerError);

        map.MapGet("get/{id}",
                  async (long id, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!) =>
                  {
                      var customField = await customFieldGroupService.GetSingleIncludingCustomFieldsAsync(id, cancellation);
                      return customField != null ? TypedResults.Ok(AsObjectResult([customField])) : Results.NotFound();
                  })
           .WithName("CustomFieldGroupGetById")
           .WithDescription("Returns single customFieldGroup by given Id")
           .Produces<object>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status500InternalServerError);

        map.MapGet("get-types-list",
                  async (ICustomFieldGroupUseCase customFieldGroupService) =>
                  {
                      return await Task.FromResult(TypedResults.Ok(customFieldGroupService.GetListOfAvailableTypes()));
                  })
           .WithName("GetCustomFieldGroupTypesList")
           .WithDescription("Returns a customFieldGroup Type to use in Dropdown")
           .Produces<EnumAsList<byte>[]>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status500InternalServerError);

        map.MapPost("create",
                   async (CustomFieldGroupDto customFieldGroup, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!) =>
                   {
                       if (customFieldGroup == null)
                       {
                           return Results.BadRequest();
                       }

                       var insertedModel = await customFieldGroupService.CreateAsync(customFieldGroup, cancellation);
                       return TypedResults.CreatedAtRoute("CustomFieldGroupGetById", new { id = insertedModel.Id });
                   })
           .WithName("CreateCustomField")
           .WithDescription("Creates new CustomFieldGroup")
           .Produces<CustomFieldGroup>(StatusCodes.Status201Created)
           .Produces(StatusCodes.Status400BadRequest)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status500InternalServerError);

        map.MapDelete("delete/{id}",
                      async (long id, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!) =>
                      {
                          var deletedModel = await customFieldGroupService.DeleteAsync(id, cancellation);
                          return !deletedModel ? Results.NotFound() : Results.NoContent();
                      })
           .WithName("DeleteCustomField")
           .WithDescription("Deletes Existed CustomFieldGroup")
           .Produces(StatusCodes.Status204NoContent)
           .Produces(StatusCodes.Status400BadRequest)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status500InternalServerError);
    }

    private static object? AsObjectResult(CustomFieldGroup[] result)
    {
        return result
               .Select(r => new
               {
                   r.Name,
                   r.EntityType,
                   r.Id,
                   customFields = r.CustomFields
                                   .Where(cf => cf.ParentId == null)
                                   .Select(cf => new
                                   {
                                       cf.Name,
                                       cf.Id,
                                       cf.IsRequired,
                                       cf.HelpText,
                                       cf.PlaceHolder,
                                       cf.InitialValue,
                                       cf.Validation,
                                       cf.ValueType,
                                       children = r.CustomFields
                                                   .Where(ch => ch.ParentId == cf.Id)
                                                   .Select(ch => new
                                                   {
                                                       ch.Name,
                                                       ch.Id,
                                                       ch.IsRequired,
                                                       cf.PlaceHolder,
                                                       ch.HelpText,
                                                       ch.InitialValue,
                                                       ch.Validation,
                                                       ch.ValueType,
                                                       ch.ParentId,
                                                       ch.ParentCondition
                                                   })
                                   })
               });
    }
}