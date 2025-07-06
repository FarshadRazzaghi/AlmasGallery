namespace AlmasGallery.Catalog.API.Endpoints;

/// <summary>
/// Configures the routes for the CustomFieldGroup endpoints.
/// </summary>
/// <remarks>
/// This method sets up the following endpoints:
/// <list type="bullet">
/// <item>
/// <term>GET api/v1/custom-field-groups</term>
/// <description>Retrieve a list of all custom field groups based on the provided filter, including their associated details.</description>
/// </item>
/// <item>
/// <term>GET api/v1/custom-field-groups/dropdown</term>
/// <description>Retrieve custom field groups formatted as key-value pairs for use in dropdown options.</description>
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
public class CustomFieldGroupEndpoint : ICarterModule
{
    /// <summary>
    /// Configures the routes for the CustomFieldGroup endpoints.
    /// </summary>
    /// <param name="app">The <see cref="IEndpointRouteBuilder"/> to add the routes to.</param>
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var map = app.MapGroup("api/v1/custom-field-groups")
                     .WithTags("Custom Field Group")
                     .WithGroupName("v1")
                     .WithDescription("Endpoints for managing custom field groups, including retrieval, creation, updating, and deletion.")
                     .WithSummary("Custom Field Group Management")
                     .RequireAuthorization(AuthenticationType.Authentication)
                     .RequiredValidation();

        map.MapGet("/", CustomFieldGroupMethods.GetCustomFieldGroupListAsync)
           .WithName("GetAllCustomFieldGroups")
           .WithSummary("Retrieve All Custom Field Groups")
           .WithDescription("Fetches a list of all custom field groups based on the provided filter, including their associated details.")
           .Produces<CustomFieldGroupResponse[]>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapGet("/dropdown", CustomFieldGroupMethods.GetCustomFieldGroupListForDropdownAsync)
           .WithName("GetCustomFieldGroupsForDropdown")
           .WithSummary("Retrieve Custom Field Groups for Dropdown")
           .WithDescription("Fetches a list of custom field groups formatted as key-value pairs for use in dropdown options.")
           .Produces<DropdownResponse[]>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapGet("/product-groups/{productCategoryId}/{activeOnly}", CustomFieldGroupMethods.GetCustomFieldGroupListForProductCategoriesAsync)
           .WithName("GetCustomFieldGroupsForProductCategory")
           .WithSummary("Retrieve Custom Field Groups for a Product Category")
           .WithDescription("Fetches a list of custom field groups associated with a specific product category, based on the provided filter, including their associated details.")
           .Produces<CustomFieldGroupResponse[]>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapGet("/{customFieldGroupId}", CustomFieldGroupMethods.GetSingleCustomFieldGroupByIdAsync)
           .WithName("GetCustomFieldGroupById")
           .WithSummary("Retrieve a Custom Field Group by ID")
           .WithDescription("Fetches a single custom field group by the specified ID, including its associated custom fields.")
           .Produces<CustomFieldGroupResponse>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status404NotFound)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapPost("/", CustomFieldGroupMethods.AddCustomFieldGroupAsync)
           .WithName("CreateCustomFieldGroup")
           .WithSummary("Create a New Custom Field Group")
           .WithDescription("Adds a new custom field group to the system with the provided details.")
           .Produces<CustomFieldGroupResponse>(StatusCodes.Status201Created)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapPut("/{customFieldGroupId}", CustomFieldGroupMethods.UpdateCustomFieldGroupAsync)
           .WithName("UpdateCustomFieldGroupById")
           .WithSummary("Update an Existing Custom Field Group by ID")
           .WithDescription("Updates the details of an existing custom field group identified by the specified ID.")
           .Produces<CustomFieldGroupResponse>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status404NotFound)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapDelete("/{customFieldGroupId}", CustomFieldGroupMethods.DeleteCustomFieldGroupAsync)
           .WithName("DeleteCustomFieldGroupById")
           .WithSummary("Delete a Custom Field Group by ID")
           .WithDescription("Deletes an existing custom field group identified by the specified ID.")
           .Produces(StatusCodes.Status204NoContent)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status404NotFound)
           .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}

/// <summary>
/// Contains methods for handling operations related to custom field groups.
/// </summary>
public static class CustomFieldGroupMethods
{
    /// <summary>
    /// Retrieves a list of custom field groups based on the provided filter.
    /// </summary>
    /// <param name="filter">The filter criteria for retrieving custom field groups.</param>
    /// <param name="httpContext">The current HTTP context.</param>
    /// <param name="customFieldGroupService">The service to handle custom field group operations.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>A result containing the list of custom field groups and the total count.</returns>
    public static async Task<IResult> GetCustomFieldGroupListAsync([AsParameters] CustomFieldGroupFilter filter, HttpContext httpContext, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
    {
        var (list, totalCount) = await customFieldGroupService.GetListAsync(filter, cancellation);
        httpContext.Response.Headers.Append("X-Total-Count", totalCount.ToString());
        return TypedResults.Ok(list.AsObjectResult());
    }

    /// <summary>
    /// Retrieves a list of custom field groups formatted for use in dropdown menus.
    /// </summary>
    /// <param name="customFieldGroupService">The service to handle custom field group operations.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A result containing a list of custom field groups as dropdown options.
    /// Each option includes a key (ID) and value (name).
    /// </returns>
    public static async Task<IResult> GetCustomFieldGroupListForDropdownAsync(ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
    {
        var filter = new CustomFieldGroupFilter();
        var (list, _) = await customFieldGroupService.GetListAsync(filter, cancellation);
        return TypedResults.Ok(list.AsDropdownObjectResult());
    }

    /// <summary>
    /// Retrieves a list of custom field groups for a specific product category.
    /// </summary>
    /// <param name="productCategoryId">The ID of the product category.</param>
    /// <param name="activeOnly">Indicates whether to include only active custom field groups.</param>
    /// <param name="httpContext">The current HTTP context.</param>
    /// <param name="customFieldGroupService">The service to handle custom field group operations.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>A result containing the list of custom field groups and the total count.</returns>
    public static async Task<IResult> GetCustomFieldGroupListForProductCategoriesAsync(long productCategoryId, bool activeOnly, HttpContext httpContext, IProductCategoryCustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
    {
        var (list, totalCount) = await customFieldGroupService.GetListAsync(productCategoryId, activeOnly, cancellation);
        httpContext.Response.Headers.Append("X-Total-Count", totalCount.ToString());
        return TypedResults.Ok(list.AsObjectResult());
    }

    /// <summary>
    /// Retrieves a single custom field group by its ID.
    /// </summary>
    /// <param name="customFieldGroupId">The ID of the custom field group.</param>
    /// <param name="customFieldGroupService">The service to handle custom field group operations.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>A result containing the custom field group if found; otherwise, a not found result.</returns>
    public static async Task<IResult> GetSingleCustomFieldGroupByIdAsync(long customFieldGroupId, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
    {
        var customFieldGroup = await customFieldGroupService.GetSingleIncludingCustomFieldsAsync(customFieldGroupId, cancellation);
        if (customFieldGroup == null)
        {
            return Results.NotFound();
        }

        var castedModel = EntityExtensions.AsObjectResult([customFieldGroup]).FirstOrDefault();
        return castedModel == null ? Results.NotFound() : TypedResults.Ok(castedModel);
    }

    /// <summary>
    /// Creates a new custom field group.
    /// </summary>
    /// <param name="customFieldGroup">The details of the custom field group to create.</param>
    /// <param name="customFieldGroupService">The service to handle custom field group operations.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>A result containing the created custom field group.</returns>
    public static async Task<IResult> AddCustomFieldGroupAsync(CustomFieldGroupRequest customFieldGroup, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
    {
        var insertedModel = await customFieldGroupService.CreateAsync(customFieldGroup, cancellation);
        return TypedResults.CreatedAtRoute("GetCustomFieldGroupById", new { customFieldGroupId = insertedModel.Id });
    }

    /// <summary>
    /// Updates an existing custom field group by its ID.
    /// </summary>
    /// <param name="customFieldGroupId">The ID of the custom field group to update.</param>
    /// <param name="customFieldGroup">The updated details of the custom field group.</param>
    /// <param name="customFieldGroupService">The service to handle custom field group operations.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>A result containing the updated custom field group if found; otherwise, a not found result.</returns>
    public static async Task<IResult> UpdateCustomFieldGroupAsync(long customFieldGroupId, CustomFieldGroupRequest customFieldGroup, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
    {
        var updatedModel = await customFieldGroupService.UpdateAsync(customFieldGroupId, customFieldGroup, cancellation);
        if (updatedModel == null)
        {
            return Results.NotFound();
        }

        var castedModel = EntityExtensions.AsObjectResult([updatedModel]).FirstOrDefault();
        return castedModel == null ? Results.NotFound() : TypedResults.Ok(castedModel);
    }

    /// <summary>
    /// Deletes a custom field group by its ID.
    /// </summary>
    /// <param name="customFieldGroupId">The ID of the custom field group to delete.</param>
    /// <param name="customFieldGroupService">The service to handle custom field group operations.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>A result indicating whether the deletion was successful.</returns>
    public static async Task<IResult> DeleteCustomFieldGroupAsync(long customFieldGroupId, ICustomFieldGroupUseCase customFieldGroupService, CancellationToken cancellation = default!)
    {
        var deletedModel = await customFieldGroupService.DeleteAsync(customFieldGroupId, cancellation);
        return !deletedModel ? Results.NotFound() : Results.NoContent();
    }
}