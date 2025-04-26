using Catalog.Application.Models.Requests;
using Catalog.Application.Models.Responses;

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
    /// <term>GET api/v1/custom-field-groups</term>
    /// <description>Retrieve a list of all custom field groups based on the provided filter, including their associated details.</description>
    /// </item>
    /// <item>
    /// <term>GET api/v1/custom-field-groups/product-groups/{productCategoryId}</term>
    /// <description>Retrieve a list of custom field groups associated with a specific product category, based on the provided filter, including their associated details.</description>
    /// </item>
    /// <item>
    /// <term>GET api/v1/custom-field-groups/{customFieldGroupId}</term>
    /// <description>Retrieve a single custom field group by its ID, including its associated custom fields.</description>
    /// </item>
    /// <item>
    /// <term>POST api/v1/custom-field-groups</term>
    /// <description>Create a new custom field group with the provided details.</description>
    /// </item>
    /// <item>
    /// <term>PUT api/v1/custom-field-groups/{customFieldGroupId}</term>
    /// <description>Update the details of an existing custom field group identified by its ID.</description>
    /// </item>
    /// <item>
    /// <term>DELETE api/v1/custom-field-groups/{customFieldGroupId}</term>
    /// <description>Delete an existing custom field group identified by its ID.</description>
    /// </item>
    /// </list>
    /// </remarks>
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var map = app.MapGroup("api/v1/custom-field-groups")
                     .WithTags("Custom Field Groups")
                     .WithGroupName("v1")
                     .WithDescription("Endpoints for managing custom field groups, including retrieval, creation, updating, and deletion.")
                     .WithSummary("Custom Field Group Management")
                     .RequireAuthorization(AuthenticationType.Authentication)
                     .RequiredValidation();

        map.MapGet("/", GetCustomFieldGroupListAsync)
           .WithName("GetAllCustomFieldGroups")
           .WithSummary("Retrieve All Custom Field Groups")
           .WithDescription("Fetches a list of all custom field groups based on the provided filter, including their associated details.")
           .Produces<CustomFieldGroupResponse[]>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapGet("/product-groups/{productCategoryId}/{activeOnly}", GetCustomFieldGroupListForProductCategoriesAsync)
           .WithName("GetCustomFieldGroupsForProductCategory")
           .WithSummary("Retrieve Custom Field Groups for a Product Category")
           .WithDescription("Fetches a list of custom field groups associated with a specific product category, based on the provided filter, including their associated details.")
           .Produces<CustomFieldGroupResponse[]>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapGet("/{customFieldGroupId}", GetSingleCustomFieldGroupByIDAsync)
           .WithName("GetCustomFieldGroupById")
           .WithSummary("Retrieve a Custom Field Group by ID")
           .WithDescription("Fetches a single custom field group by the specified ID, including its associated custom fields.")
           .Produces<CustomFieldGroupResponse>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status404NotFound)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapPost("/", AddCustomFieldGroupAsync)
           .WithName("CreateCustomFieldGroup")
           .WithSummary("Create a New Custom Field Group")
           .WithDescription("Adds a new custom field group to the system with the provided details.")
           .Produces<CustomFieldGroupResponse>(StatusCodes.Status201Created)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapPut("/{customFieldGroupId}", UpdateCustomFieldGroupAsync)
           .WithName("UpdateCustomFieldGroupById")
           .WithSummary("Update an Existing Custom Field Group by ID")
           .WithDescription("Updates the details of an existing custom field group identified by the specified ID.")
           .Produces<CustomFieldGroupResponse>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status404NotFound)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapDelete("/{customFieldGroupId}", DeleteCustomFieldGroupAsync)
           .WithName("DeleteCustomFieldGroupById")
           .WithSummary("Delete a Custom Field Group by ID")
           .WithDescription("Deletes an existing custom field group identified by the specified ID.")
           .Produces(StatusCodes.Status204NoContent)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status404NotFound)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        static async Task<IResult> GetCustomFieldGroupListAsync([AsParameters] CustomFieldGroupFilter filter, HttpContext httpContext, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
        {
            var (list, totalCount) = await customFieldGroupService.GetListAsync(filter, cancellation);
            httpContext.Response.Headers.Append("X-Total-Count", totalCount.ToString());
            return TypedResults.Ok(AsObjectResult(list));
        }

        static async Task<IResult> GetCustomFieldGroupListForProductCategoriesAsync(long productCategoryId, bool activeOnly, HttpContext httpContext, IProductCategoryCustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
        {
            var (list, totalCount) = await customFieldGroupService.GetListAsync(productCategoryId, activeOnly, cancellation);
            httpContext.Response.Headers.Append("X-Total-Count", totalCount.ToString());
            return TypedResults.Ok(AsObjectResult(list));
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

        static async Task<IResult> AddCustomFieldGroupAsync(CustomFieldGroupRequest customFieldGroup, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
        {
            var insertedModel = await customFieldGroupService.CreateAsync(customFieldGroup, cancellation);
            return TypedResults.CreatedAtRoute("CustomFieldGroupGetById", new { customFieldGroupId = insertedModel.Id });
        }

        static async Task<IResult> UpdateCustomFieldGroupAsync(long customFieldGroupId, CustomFieldGroupRequest customFieldGroup, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
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

    private static CustomFieldGroupResponse[] AsObjectResult(CustomFieldGroup[] result)
        => [.. result
              .Select(r => new CustomFieldGroupResponse
              {
                  Id = r.Id,
                  Name = r.Name,
                  EntityType = (Common.CustomFieldGroupEntityType)r.EntityType,
                  CustomFields = [.. r.CustomFields
                                      .Select(cf => new CustomFieldResponse
                                      {
                                          Name = cf.Name,
                                          Id = cf.Id,
                                          IsRequired = cf.IsRequired,
                                          HelpText = cf.HelpText,
                                          PlaceHolder = cf.PlaceHolder,
                                          InitialValue = cf.InitialValue,
                                          Validation = cf.Validation,
                                          DataType = (Common.CustomFieldDataType)cf.DataType,
                                          IsActive = cf.IsActive,
                                          ParentId = cf.ParentId,
                                          ParentCondition = cf.ParentCondition,
                                      })],
              })];

    private static ProductCategoryCustomFieldGroupResponse[] AsObjectResult(ProductCategoryCustomFieldGroup[] result)
        => [.. result
              .Select(r => new ProductCategoryCustomFieldGroupResponse
              {
                  Id = r.CustomFieldGroupId,
                  Name = r.CustomFieldGroup.Name,
                  Location = (Common.CustomFieldGroupLocationType)r.CustomFieldGroupLocation,
                  EntityType = Common.CustomFieldGroupEntityType.Product,
                  IsActive = r.IsActive,
                  CustomFields = [.. r.CustomFieldGroup.CustomFields
                                      .Select(cf => new CustomFieldResponse
                                      {
                                          Name = cf.Name,
                                          Id = cf.Id,
                                          IsRequired = cf.IsRequired,
                                          HelpText = cf.HelpText,
                                          PlaceHolder = cf.PlaceHolder,
                                          InitialValue = cf.InitialValue,
                                          Validation = cf.Validation,
                                          DataType = (Common.CustomFieldDataType)cf.DataType,
                                          IsActive = cf.IsActive,
                                          ParentId = cf.ParentId,
                                          ParentCondition = cf.ParentCondition,
                                      })],
              })];
}
