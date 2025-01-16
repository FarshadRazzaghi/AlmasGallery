namespace Catalog.API.Endpoints;

public class CustomFieldGroupEndpoint : ICarterModule
{
    /// <summary>
    /// Configures the routes for the CustomFieldGroup endpoints.
    /// </summary>
    /// <param name="app">The <see cref="IEndpointRouteBuilder"/> to add the routes to.</param>
    /// <remarks>
    /// This method sets up the following endpoints:
    /// <list type="bullet">
    /// <item>
    /// <term>GET api/v2/custom-field-groups</term>
    /// <description>Returns a list of custom field groups based on the provided filter, including their custom fields.</description>
    /// </item>
    /// <item>
    /// <term>GET api/v2/custom-field-groups/{customFieldGroupId}</term>
    /// <description>Returns a single custom field group by the given ID, including its custom fields.</description>
    /// </item>
    /// <item>
    /// <term>POST api/v2/custom-field-groups</term>
    /// <description>Creates a new custom field group.</description>
    /// </item>
    /// <item>
    /// <term>PUT api/v2/custom-field-groups/{customFieldGroupId}</term>
    /// <description>Updates an existing custom field group by the given ID.</description>
    /// </item>
    /// <item>
    /// <term>DELETE api/v2/custom-field-groups/{id}</term>
    /// <description>Deletes an existing custom field group by the given ID.</description>
    /// </item>
    /// <item>
    /// <term>GET api/v2/custom-field-groups/types-list</term>
    /// <description>Returns a list of available custom field group types for use in dropdowns.</description>
    /// </item>
    /// </list>
    /// </remarks>
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var map = app.MapGroup("api/v2/custom-field-groups")
                     .WithGroupName("CustomFieldGroup")
                     .RequireAuthorization(AuthenticationType.Authentication)
                     .RequiredValidation();

        map.MapGet("/", GetCustomFieldGroupListAsync)
           .WithName("CustomFieldGroupGetList")
           .WithDescription("Returns a list of custom field groups based on the provided filter, including their custom fields.")
           .Produces<object[]>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status500InternalServerError);

        map.MapGet("/{customFieldGroupId}", GetSingleCustomFieldGroupByIDAsync)
           .WithName("CustomFieldGroupGetById")
           .WithDescription("Returns a single custom field group by the given ID, including its custom fields.")
           .Produces<object>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status500InternalServerError);

        map.MapPost("/", CreateCustomFieldGroupAsync)
           .WithName("CreateCustomFieldGroup")
           .WithDescription("Creates a new custom field group.")
           .Produces<CustomFieldGroup>(StatusCodes.Status201Created)
           .Produces(StatusCodes.Status400BadRequest)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status500InternalServerError);

        map.MapPut("/{customFieldGroupId}", UpdateCustomFieldGroupAsync)
           .WithName("UpdateCustomFieldGroup")
           .WithDescription("Updates an existing custom field group by the given ID.")
           .Produces<CustomFieldGroup>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status400BadRequest)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status500InternalServerError);

        map.MapDelete("/{customFieldGroupId}", DeleteCustomFieldGroupAsync)
           .WithName("DeleteCustomFieldGroup")
           .WithDescription("Deletes an existing custom field group by the given ID.")
           .Produces(StatusCodes.Status204NoContent)
           .Produces(StatusCodes.Status400BadRequest)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status500InternalServerError);

        static async Task<IResult> GetCustomFieldGroupListAsync([AsParameters] CustomFieldGroupFilter filter, HttpContext httpContext, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
        {
            var (list, totalCount) = await customFieldGroupService.GetListIncludingCustomFieldsAsync(filter, cancellation);
            httpContext.Response.Headers.Append("X-Total-Count", totalCount.ToString());
            return Results.Ok(AsObjectResult(list));
        }

        static async Task<IResult> GetSingleCustomFieldGroupByIDAsync(long customFieldGroupId, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
        {
            var customFieldGroup = await customFieldGroupService.GetSingleIncludingCustomFieldsAsync(customFieldGroupId, cancellation);
            if (customFieldGroup == null)
            {
                return Results.NotFound();
            }

            var castedModel = AsObjectResult([customFieldGroup]).FirstOrDefault();
            return castedModel == null ? Results.NotFound() : TypedResults.Ok(castedModel);
        }

        static async Task<IResult> CreateCustomFieldGroupAsync(CustomFieldGroupDto customFieldGroup, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
        {
            var insertedModel = await customFieldGroupService.CreateAsync(customFieldGroup, cancellation);
            return Results.CreatedAtRoute("CustomFieldGroupGetById", new { customFieldGroupId = insertedModel.Id }, AsObjectResult([insertedModel]));
        }

        static async Task<IResult> UpdateCustomFieldGroupAsync(long customFieldGroupId, CustomFieldGroupDto customFieldGroup, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
        {
            var updatedModel = await customFieldGroupService.UpdateAsync(customFieldGroupId, customFieldGroup, cancellation);
            if (updatedModel == null)
            {
                return Results.NotFound();
            }

            var castedModel = AsObjectResult([updatedModel]).FirstOrDefault();
            return castedModel == null ? Results.NotFound() : TypedResults.Ok(castedModel);
        }

        static async Task<IResult> DeleteCustomFieldGroupAsync(long customFieldGroupId, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
        {
            var deletedModel = await customFieldGroupService.DeleteAsync(customFieldGroupId, cancellation);
            return !deletedModel ? Results.NotFound() : Results.NoContent();
        }
    }

    private static object[] AsObjectResult(CustomFieldGroup[] result)
    {
        var toRet = new List<object>();
        return result
               .Select(r => new
               {
                   r.Name,
                   r.EntityType,
                   r.Id,
                   customFields = r.CustomFields
                                   .Select(cf => new
                                   {
                                       cf.Name,
                                       cf.Id,
                                       cf.IsRequired,
                                       cf.HelpText,
                                       cf.PlaceHolder,
                                       cf.InitialValue,
                                       cf.Validation,
                                       cf.DataType,
                                       cf.IsActive,
                                       cf.ParentId,
                                       cf.ParentCondition,
                                   })
               })
               .ToArray();
    }
}
