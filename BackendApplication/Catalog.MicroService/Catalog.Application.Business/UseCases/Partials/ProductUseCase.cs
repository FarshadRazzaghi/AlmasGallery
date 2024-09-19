using Catalog.Application.Contract.Repository;
using Catalog.Application.Contract.UseCase;
using Catalog.Domain.Model;

namespace Catalog.Application.Business.UseCase;

internal partial class ProductUseCase(IProductRepository productRepository) : BaseUseCase<Product>(productRepository), IProductUseCase
{
}
