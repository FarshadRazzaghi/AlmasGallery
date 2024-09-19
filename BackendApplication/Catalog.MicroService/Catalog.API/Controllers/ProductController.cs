using Catalog.Application.Contract.UseCase;
using Catalog.Domain.Model;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController(IProductUseCase productUseCase) : Controller
{
    private readonly IProductUseCase productUseCase = productUseCase;

    /// <summary>
    /// GET ALL PRODUCTS
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
            var products = await productUseCase.GetListAsNoTrackingAsync(cancellationToken);
            return Results.Ok(products);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
        }
    }
}
