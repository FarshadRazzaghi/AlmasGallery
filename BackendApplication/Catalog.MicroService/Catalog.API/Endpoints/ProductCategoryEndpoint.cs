namespace Catalog.API.Endpoints;

public class ProductCategoryEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var map = app.MapGroup("api/v2/product-categories")
                     .WithGroupName("ProductCategory")
                     .RequireAuthorization(AuthenticationType.Authentication)
                     .RequiredValidation();

        map.MapGet("/", GetProductCategoryListAsync)
           .WithName("ProductCategoryGetList")
           .WithDescription("Returns a list of product categories based on the provided filter, including their product categories.")
           .Produces<object[]>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status500InternalServerError);

        map.MapGet("/{productCategoryId}", GetSingleProductCategoryByIDAsync)
           .WithName("ProductCategoryGetById")
           .WithDescription("Returns a single product category by the given ID, including its product categories.")
           .Produces<object>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status500InternalServerError);

        map.MapPost("/", CreateProductCategoryAsync)
           .WithName("CreateProductCategory")
           .WithDescription("Creates a new product category.")
           .Produces<ProductCategory>(StatusCodes.Status201Created)
           .Produces(StatusCodes.Status400BadRequest)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status500InternalServerError);

        map.MapPut("/{productCategoryId}", UpdateProductCategoryAsync)
           .WithName("UpdateProductCategory")
           .WithDescription("Updates an existing product category by the given ID.")
           .Produces<ProductCategory>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status400BadRequest)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status500InternalServerError);

        map.MapDelete("/{productCategoryId}", DeleteProductCategoryAsync)
           .WithName("DeleteProductCategory")
           .WithDescription("Deletes an existing product category by the given ID.")
           .Produces(StatusCodes.Status204NoContent)
           .Produces(StatusCodes.Status400BadRequest)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status500InternalServerError);

        static async Task<IResult> GetProductCategoryListAsync([AsParameters] ProductCategoryFilter filter, HttpContext httpContext, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
        {
            var (list, totalCount) = await productCategoryService.GetListIncludingCustomFieldGroupsAsync(filter, cancellation);
            httpContext.Response.Headers.Append("X-Total-Count", totalCount.ToString());
            return Results.Ok(AsObjectResult(list));
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

        static async Task<IResult> CreateProductCategoryAsync(ProductCategoryDto productCategory, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
        {
            var insertedModel = await productCategoryService.CreateAsync(productCategory, cancellation);
            return Results.CreatedAtRoute("ProductCategoryGetById", new { ProductCategoryId = insertedModel.Id }, AsObjectResult([insertedModel]));
        }

        static async Task<IResult> UpdateProductCategoryAsync(long productCategoryId, ProductCategoryDto productCategory, IProductCategoryUseCase productCategoryService, CancellationToken cancellation = default!)
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

    private static object[] AsObjectResult(ProductCategory[] result)
    {
        var toRet = new List<object>();
        return result
               .Select(r => new
               {
                   r.Name,
                   r.Description,
                   r.Id,
                   r.ParentId,
                   CustomFieldGroups = r.ProductCategoryCustomFieldGroups
                                   .Select(cf => new
                                   {
                                       cf.Id,
                                       cf.ProductCategoryId,
                                       cf.CustomFieldGroupId,
                                       cf.CustomFieldGroupLocation,
                                       cf.IsActive,
                                   })
               })
               .ToArray();
    }
}