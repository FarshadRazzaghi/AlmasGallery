namespace AlmasGallery.Catalog.API.Endpoints;

/// <summary>
/// Configures the routes for the ProductCategory endpoints.
/// </summary>
/// <remarks>
/// This method sets up the following endpoints:
/// <list type="bullet">
/// <item>
/// <term>GET api/v1/product-categories</term>
/// <description>Retrieve a list of all product categories based on the provided filter, including their associated details.</description>
/// </item>
/// <item>
/// <term>GET api/v1/product-categories/dropdown</term>
/// <description>Retrieve product categories formatted as key-value pairs for use in dropdown options.</description>
/// </item>
/// <item>
/// <term>GET api/v1/product-categories/{productCategoryId}</term>
/// <description>Retrieve a single product category by its ID, including its associated custom field groups.</description>
/// </item>
/// <item>
/// <term>POST api/v1/product-categories</term>
/// <description>Create a new product category with the provided details.</description>
/// </item>
/// <item>
/// <term>PUT api/v1/product-categories/{productCategoryId}</term>
/// <description>Update the details of an existing product category identified by its ID.</description>
/// </item>
/// <item>
/// <term>DELETE api/v1/product-categories/{productCategoryId}</term>
/// <description>Delete an existing product category identified by its ID.</description>
/// </item>
/// </list>
/// </remarks>
public class ProductCategoryEndpoint : ICarterModule
{
    /// <summary>
    /// Configures the routes for the ProductCategory endpoints.
    /// </summary>
    /// <param name="app">The <see cref="IEndpointRouteBuilder"/> to add the routes to.</param>
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var map = app.MapGroup("api/v1/product-categories")
                     .WithTags("Product Category")
                     .WithGroupName("v1")
                     .WithDescription("Endpoints for managing product categories, including retrieval, creation, updating, and deletion.")
                     .WithSummary("Product Category Management")
                     .RequireAuthorization(AuthenticationType.Authentication)
                     .RequiredValidation();

        map.MapGet("/", ProductCategoryMethods.GetProductCategoryListAsync)
           .WithName("GetAllProductCategories")
           .WithSummary("Retrieve All Product Categories")
           .WithDescription("Fetches a list of all product categories based on the provided filter, including their associated details.")
           .Produces<ProductCategoryResponse[]>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapGet("/dropdown", ProductCategoryMethods.GetProductCategoryListForDropdownAsync)
           .WithName("GetProductCategoriesForDropdown")
           .WithSummary("Retrieve Product Categories for Dropdown")
           .WithDescription("Fetches a list of product categories formatted as key-value pairs for use in dropdown options.")
           .Produces<DropdownResponse[]>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapGet("/{productCategoryId}", ProductCategoryMethods.GetSingleProductCategoryByIdAsync)
           .WithName("GetProductCategoryById")
           .WithSummary("Retrieve a Product Category by ID")
           .WithDescription("Fetches a single product category by the specified ID, including its associated custom field groups.")
           .Produces<ProductCategoryResponse>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status404NotFound)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapPost("/", ProductCategoryMethods.AddProductCategoryAsync)
           .WithName("CreateProductCategory")
           .WithSummary("Create a New Product Category")
           .WithDescription("Adds a new product category to the system with the provided details.")
           .Produces<ProductCategoryResponse>(StatusCodes.Status201Created)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapPut("/{productCategoryId}", ProductCategoryMethods.UpdateProductCategoryAsync)
           .WithName("UpdateProductCategoryById")
           .WithSummary("Update an Existing Product Category by ID")
           .WithDescription("Updates the details of an existing product category identified by the specified ID.")
           .Produces<ProductCategoryResponse>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status404NotFound)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapDelete("/{productCategoryId}", ProductCategoryMethods.DeleteProductCategoryAsync)
           .WithName("DeleteProductCategoryById")
           .WithSummary("Delete a Product Category by ID")
           .WithDescription("Deletes an existing product category identified by the specified ID.")
           .Produces(StatusCodes.Status204NoContent)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status404NotFound)
           .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}

/// <summary>
/// Contains methods for handling operations related to Product Categories.
/// </summary>
public static class ProductCategoryMethods
{
    /// <summary>
    /// Retrieves a list of product categories based on the provided filter.
    /// </summary>
    /// <param name="filter">The filter criteria for retrieving product categories.</param>
    /// <param name="httpContext">The current HTTP context.</param>
    /// <param name="productCategoryService">The service to handle product category operations.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>A result containing the list of product categories and the total count.</returns>
    public static async Task<IResult> GetProductCategoryListAsync([AsParameters] ProductCategoryFilter filter, HttpContext httpContext, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
    {
        var (list, totalCount) = await productCategoryService.GetListAsync(filter, cancellation);
        httpContext.Response.Headers.Append("X-Total-Count", totalCount.ToString());
        return TypedResults.Ok(list.AsObjectResult());
    }

    /// <summary>
    /// Retrieves a list of product categories formatted for use in dropdown menus.
    /// </summary>
    /// <param name="filter">The filter criteria for retrieving product categories.</param>
    /// <param name="productCategoryService">The service to handle product category operations.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A result containing a list of product categories as dropdown options.
    /// Each option includes a key (ID) and value (Name).
    /// </returns>
    public static async Task<IResult> GetProductCategoryListForDropdownAsync([AsParameters] ProductCategoryDropdownFilter filter, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
    {
        var (list, _) = await productCategoryService.GetListForDropdownAsync(filter, cancellation);
        return TypedResults.Ok(list.AsDropdownObjectResult());
    }

    /// <summary>
    /// Retrieves a single product category by its ID, including its custom field groups.
    /// </summary>
    /// <param name="productCategoryId">The ID of the product category.</param>
    /// <param name="productCategoryService">The service to handle product category operations.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>
    /// A result containing the product category if found; otherwise, a not found result.
    /// </returns>
    public static async Task<IResult> GetSingleProductCategoryByIdAsync(long productCategoryId, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
    {
        var productCategory = await productCategoryService.GetSingleIncludingCustomFieldGroupsAsync(productCategoryId, cancellation);
        if (productCategory == null)
        {
            return Results.NotFound();
        }

        var castedModel = EntityExtensions.AsObjectResult([productCategory]).FirstOrDefault();
        return castedModel == null ? Results.NotFound() : TypedResults.Ok(castedModel);
    }

    /// <summary>
    /// Creates a new product category.
    /// </summary>
    /// <param name="productCategory">The details of the product category to create.</param>
    /// <param name="productCategoryService">The service to handle product category operations.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>A result containing the created product category.</returns>
    public static async Task<IResult> AddProductCategoryAsync(ProductCategoryRequest productCategory, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
    {
        var insertedModel = await productCategoryService.CreateAsync(productCategory, cancellation);
        return TypedResults.CreatedAtRoute("GetProductCategoryById", new { ProductCategoryId = insertedModel.Id });
    }

    /// <summary>
    /// Updates an existing product category by its ID.
    /// </summary>
    /// <param name="productCategoryId">The ID of the product category to update.</param>
    /// <param name="productCategory">The updated details of the product category.</param>
    /// <param name="productCategoryService">The service to handle product category operations.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>A result containing the updated product category if found; otherwise, a not found result.</returns>
    public static async Task<IResult> UpdateProductCategoryAsync(long productCategoryId, ProductCategoryRequest productCategory, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
    {
        var updatedModel = await productCategoryService.UpdateAsync(productCategoryId, productCategory, cancellation);
        if (updatedModel == null)
        {
            return Results.NotFound();
        }

        var castedModel = EntityExtensions.AsObjectResult([updatedModel]).FirstOrDefault();
        return castedModel == null ? Results.NotFound() : TypedResults.Ok(castedModel);
    }

    /// <summary>
    /// Deletes a product category by its ID.
    /// </summary>
    /// <param name="productCategoryId">The ID of the product category to delete.</param>
    /// <param name="productCategoryService">The service to handle product category operations.</param>
    /// <param name="cancellation">A token to monitor for cancellation requests.</param>
    /// <returns>A result indicating whether the deletion was successful.</returns>
    public static async Task<IResult> DeleteProductCategoryAsync(long productCategoryId, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
    {
        var deletedModel = await productCategoryService.DeleteAsync(productCategoryId, cancellation);
        return !deletedModel ? Results.NotFound() : Results.NoContent();
    }
}