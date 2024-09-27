﻿using Catalog.Application.Model;
using Catalog.Domain.Model;

namespace Catalog.Application.Contract.UseCase;

public interface IProductUseCase : IBaseUseCase<Product>
{
    Task<Product> CreateAsync(AddProductDto product, CancellationToken cancellationToken = default!);
}
