using Catalog.Application.Contract.UseCase;
using Catalog.Application.Model;
using Catalog.Domain.Model;
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
    /// <returns></returns>
    [HttpGet("get", Name = "GetProducts")]
    [ProducesResponseType(500)]
    [ProducesResponseType(typeof(Product[]), 200)]
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
    /// Returns single product with the given Id
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("get/{id}", Name = "GetProductById")]
    [ProducesResponseType(500)]
    [ProducesResponseType(typeof(object), 404)]
    [ProducesResponseType(typeof(Product), 200)]
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
    /// <param name="product"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("create", Name = "CreateProduct")]
    [ProducesResponseType(500)]
    [ProducesResponseType(201)]
    public async Task<IResult> CreateProduct(AddProductDto product, CancellationToken cancellationToken = default!)
    {
        try
        {
            var insertedModel = await productUseCase.CreateAsync(product, cancellationToken);
            return Results.CreatedAtRoute("GetProductById", new { id = insertedModel.Id }, insertedModel);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
        }
    }
}
