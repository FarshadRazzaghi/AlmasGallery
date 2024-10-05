using Catalog.Application.Contract.UseCase;
using Catalog.Application.Models;
using Catalog.Domain.Models;
using Catalog.Domain.Models.Errors;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController(IProductUseCase productUseCase) : Controller
{
    private readonly IProductUseCase productUseCase = productUseCase;

    /// <summary>
    /// Returns list of all products
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns>List of all Products.</returns>
    /// <response code="200">Returns list of all products</response>
    /// <response code="401">Unauthorized Request, check the authentication</response>
    /// <response code="500">An internal error occurred while processing request</response>
    [HttpGet("get", Name = "GetProducts")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Product[]), 200)]
    [ProducesResponseType(typeof(ProblemDetails), 401)]
    [ProducesResponseType(500)]
    public async Task<IResult> GetProductsAsync(CancellationToken cancellationToken = default!)
    {
        try
        {
            var products = await productUseCase.GetListAsync(cancellationToken);
            return Results.Ok(products);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    /// Returns single product by given Id
    /// </summary>
    /// <param name="id">Desired id to get single product by</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Single Product filtered by given id</returns>
    /// <response code="200">Returns single product with the given Id</response>
    /// <response code="401">Unauthorized Request, check the authentication</response>
    /// <response code="404">Selected product not found</response>
    /// <response code="500">An internal error occurred while processing request</response>
    [HttpGet("get/{id}", Name = "GetProductById")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Product), 200)]
    [ProducesResponseType(typeof(NotFoundError), 404)]
    [ProducesResponseType(typeof(ProblemDetails), 401)]
    [ProducesResponseType(500)]
    public async Task<IResult> GetProductByIdAsync(long id, CancellationToken cancellationToken = default!)
    {
        try
        {
            var product = await productUseCase.GetByIdAsync(id, cancellationToken);
            if (product == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(product);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    /// Creates new Products
    /// </summary>
    /// <param name="product">Object of new Product to insert</param>
    /// <param name="cancellationToken"></param>
    /// <returns>Newly created product</returns>
    /// <response code="201">Newly created product</response>
    /// <response code="400">If the <paramref name="product"/> is null</response>
    /// <response code="401">Unauthorized Request, check the authentication</response>
    /// <response code="500">An internal error occurred while processing request</response>
    [HttpPost("create", Name = "CreateProduct")]
    [ProducesResponseType(typeof(Product), 201)]
    [ProducesResponseType(typeof(BadRequestError), 400)]
    [ProducesResponseType(typeof(ProblemDetails), 401)]
    [ProducesResponseType(500)]
    public async Task<IResult> CreateProduct(ProductDto product, CancellationToken cancellationToken = default!)
    {
        try
        {
            if (product == null)
            {
                return Results.BadRequest(new BadRequestError());
            }

            var insertedModel = await productUseCase.CreateAsync(product, cancellationToken);
            return Results.CreatedAtRoute("GetProductById", new { id = insertedModel.Id }, insertedModel);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    /// Updates Existed Products
    /// </summary>
    /// <param name="id">Desired id to get product to update</param>
    /// <param name="product"></param>
    /// <param name="cancellationToken"></param>
    /// <returns>Updated product</returns>
    /// <remarks></remarks>
    /// <response code="201">Updated product</response>
    /// <response code="400">If the <paramref name="product"/> is null</response>
    /// <response code="401">Unauthorized Request, check the authentication</response>
    /// <response code="404">Selected product not found</response>
    /// <response code="500">An internal error occurred while processing request</response>
    [HttpPost("update/{id}", Name = "UpdateProduct")]
    [ProducesResponseType(typeof(Product), 201)]
    [ProducesResponseType(typeof(BadRequestError), 400)]
    [ProducesResponseType(typeof(ProblemDetails), 401)]
    [ProducesResponseType(typeof(NotFoundError), 404)]
    [ProducesResponseType(500)]
    public async Task<IResult> UpdateProduct(long id, ProductDto product, CancellationToken cancellationToken = default!)
    {
        try
        {
            if (product == null)
            {
                return Results.BadRequest(new BadRequestError());
            }

            var updatedModel = await productUseCase.UpdateAsync(id, product, cancellationToken);
            if (updatedModel == null)
            {
                return Results.NotFound();
            }

            return Results.CreatedAtRoute("GetProductById", new { id = updatedModel.Id }, updatedModel);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
        }
    }
}