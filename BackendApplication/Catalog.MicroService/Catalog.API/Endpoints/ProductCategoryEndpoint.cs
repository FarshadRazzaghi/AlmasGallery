using Catalog.Application.Models.Requests;
using Catalog.Application.Models.Responses;

namespace Catalog.API.Endpoints;

public class ProductCategoryEndpoint : ICarterModule
{
    /// <summary>
    /// Configures the routes for the ProductCategory endpoints.
    /// </summary>
    /// <param name="app">The <see cref="IEndpointRouteBuilder"/> to add the routes to.</param>
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
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var map = app.MapGroup("api/v1/product-categories")
                     .WithTags("Product Category")
                     .WithGroupName("v1")
                     .WithDescription("Endpoints for managing product categories, including retrieval, creation, updating, and deletion.")
                     .WithSummary("Product Category Management")
                     .RequireAuthorization(AuthenticationType.Authentication)
                     .RequiredValidation();

        map.MapGet("/", GetProductCategoryListAsync)
           .WithName("GetAllProductCategories")
           .WithSummary("Retrieve All Product Categories")
           .WithDescription("Fetches a list of all product categories based on the provided filter, including their associated details.")
           .Produces<ProductCategoryResponse[]>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapGet("/dropdown", GetProductCategoryListForDropdownAsync)
           .WithName("GetProductCategoriesForDropdown")
           .WithSummary("Retrieve Product Categories for Dropdown")
           .WithDescription("Fetches a list of product categories formatted as key-value pairs for use in dropdown options.")
           .Produces<DropdownResponse[]>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapGet("/{productCategoryId}", GetSingleProductCategoryByIDAsync)
           .WithName("GetProductCategoryById")
           .WithSummary("Retrieve a Product Category by ID")
           .WithDescription("Fetches a single product category by the specified ID, including its associated custom field groups.")
           .Produces<ProductCategoryResponse>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status404NotFound)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapPost("/", AddProductCategoryAsync)
           .WithName("CreateProductCategory")
           .WithSummary("Create a New Product Category")
           .WithDescription("Adds a new product category to the system with the provided details.")
           .Produces<ProductCategoryResponse>(StatusCodes.Status201Created)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapPut("/{productCategoryId}", UpdateProductCategoryAsync)
           .WithName("UpdateProductCategoryById")
           .WithSummary("Update an Existing Product Category by ID")
           .WithDescription("Updates the details of an existing product category identified by the specified ID.")
           .Produces<ProductCategoryResponse>(StatusCodes.Status200OK)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status404NotFound)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        map.MapDelete("/{productCategoryId}", DeleteProductCategoryAsync)
           .WithName("DeleteProductCategoryById")
           .WithSummary("Delete a Product Category by ID")
           .WithDescription("Deletes an existing product category identified by the specified ID.")
           .Produces(StatusCodes.Status204NoContent)
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status401Unauthorized)
           .ProducesProblem(StatusCodes.Status404NotFound)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        static async Task<IResult> GetProductCategoryListAsync([AsParameters] ProductCategoryFilter filter, HttpContext httpContext, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
        {
            var (list, totalCount) = await productCategoryService.GetListAsync(filter, cancellation);
            httpContext.Response.Headers.Append("X-Total-Count", totalCount.ToString());
            return TypedResults.Ok(AsObjectResult(list));
        }

        static async Task<IResult> GetProductCategoryListForDropdownAsync(HttpContext httpContext, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
        {
            var filter = new ProductCategoryFilter();
            var (list, totalCount) = await productCategoryService.GetListAsync(filter, cancellation);
            return TypedResults.Ok(AsDropdownObjectResult(list));
        }

        static async Task<IResult> GetSingleProductCategoryByIDAsync(long productCategoryId, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
        {
            var productCategory = await productCategoryService.GetSingleIncludingCustomFieldGroupsAsync(productCategoryId, cancellation);
            if (productCategory == null)
            {
                return Results.NotFound();
            }

            var castedModel = AsObjectResult([productCategory]).FirstOrDefault();
            return castedModel == null ? Results.NotFound() : TypedResults.Ok(castedModel);
        }

        static async Task<IResult> AddProductCategoryAsync(ProductCategoryRequest productCategory, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
        {
            var insertedModel = await productCategoryService.CreateAsync(productCategory, cancellation);
            return TypedResults.CreatedAtRoute("ProductCategoryGetById", new { ProductCategoryId = insertedModel.Id });
        }

        static async Task<IResult> UpdateProductCategoryAsync(long productCategoryId, ProductCategoryRequest productCategory, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
        {
            var updatedModel = await productCategoryService.UpdateAsync(productCategoryId, productCategory, cancellation);
            if (updatedModel == null)
            {
                return Results.NotFound();
            }

            var castedModel = AsObjectResult([updatedModel]).FirstOrDefault();
            return castedModel == null ? Results.NotFound() : TypedResults.Ok(castedModel);
        }

        static async Task<IResult> DeleteProductCategoryAsync(long productCategoryId, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
        {
            var deletedModel = await productCategoryService.DeleteAsync(productCategoryId, cancellation);
            return !deletedModel ? Results.NotFound() : Results.NoContent();
        }
    }

    private static ProductCategoryResponse[] AsObjectResult(ProductCategory[] result)
        => [.. result
               .Select(r => new ProductCategoryResponse
               {
                   Id = r.Id,
                   Name = r.Name,
                   Description = r.Description,
                   ParentId = r.ParentId,
                   CustomFieldGroups = [.. r.ProductCategoryCustomFieldGroups
                                            .Select(cf => new ProductCategoryCustomFieldGroupResponse
                                            {
                                                Id = cf.CustomFieldGroupId,
                                                Location = (Common.CustomFieldGroupLocationType)cf.CustomFieldGroupLocation,
                                                EntityType =Common.CustomFieldGroupEntityType.Product,
                                                IsActive = cf.IsActive,
                                                //Name = cf.CustomFieldGroup?.Name ?? string.Empty,
                                                //CustomFields = [],
                                            })]
               })];

    private static DropdownResponse[] AsDropdownObjectResult(ProductCategory[] result)
        => [.. result.Select(r => new DropdownResponse { Value = r.Name, Key = r.Id })];
}