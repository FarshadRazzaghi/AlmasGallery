using Carter;
using Catalog.Application.Contract.UseCase;
using Catalog.Application.Models;
using Catalog.Domain.Models;

namespace Catalog.API.Endpoints;

public class ProductEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var map = app.MapGroup("api/v2/product");

        map.MapGet("get",
                  async (IProductUseCase productService, CancellationToken cancellation = default!) =>
                  {
                      return TypedResults.Ok(await productService.GetListAsync(cancellation));
                  })
           .WithGroupName("Product")
           .WithName("ProductGetList")
           .WithDescription("Returns list of all products")
           .Produces<Product[]>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status500InternalServerError)
           .RequireAuthorization("Authentication");

        map.MapGet("get/{id}",
                  async (long id, IProductUseCase productService, CancellationToken cancellation = default!) =>
                  {
                      var product = await productService.GetByIdAsync(id, cancellation);
                      return product != null ? TypedResults.Ok(product) : Results.NotFound();
                  })
           .WithGroupName("Product")
           .WithName("ProductGetById")
           .WithDescription("Returns single product by given Id")
           .Produces<Product>(StatusCodes.Status200OK)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status500InternalServerError)
           .RequireAuthorization("Authentication");

        map.MapPost("create",
                   async (ProductDto product, IProductUseCase productService, CancellationToken cancellation = default!) =>
                   {
                       if (product == null)
                       {
                           return Results.BadRequest();
                       }

                       var insertedModel = await productService.CreateAsync(product, cancellation);
                       return Results.CreatedAtRoute("GetById", new { id = insertedModel.Id }, insertedModel);
                   })
           .WithGroupName("Product")
           .WithName("CreateProduct")
           .WithDescription("Creates new Product")
           .Produces<Product>(StatusCodes.Status201Created)
           .Produces(StatusCodes.Status400BadRequest)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status500InternalServerError)
           .RequireAuthorization("Authentication");

        map.MapPost("update/{id}",
                   async (long id, ProductDto product, IProductUseCase productService, CancellationToken cancellation = default!) =>
                   {
                       if (product == null)
                       {
                           return Results.BadRequest();
                       }

                       var updatedModel = await productService.UpdateAsync(id, product, cancellation);
                       if (updatedModel == null)
                       {
                           return Results.NotFound();
                       }

                       return Results.CreatedAtRoute("GetProductById", new { id = updatedModel.Id }, updatedModel);
                   })
           .WithGroupName("Product")
           .WithName("UpdateProduct")
           .WithDescription("Updates Existed Products")
           .Produces<Product>(StatusCodes.Status201Created)
           .Produces(StatusCodes.Status400BadRequest)
           .Produces(StatusCodes.Status401Unauthorized)
           .Produces(StatusCodes.Status404NotFound)
           .Produces(StatusCodes.Status500InternalServerError)
           .RequireAuthorization("Authentication");
    }
}
