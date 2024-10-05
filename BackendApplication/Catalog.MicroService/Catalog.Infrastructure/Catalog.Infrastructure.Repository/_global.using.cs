global using Catalog.Application.Contract.Persistence;
global using Catalog.Domain.Models;
global using Catalog.Infrastructure.Persistence;

using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Catalog.Application.Business")]
[assembly: InternalsVisibleTo("Catalog.Common.DependencyInjection")]
namespace Catalog.Infrastructure.Repository;