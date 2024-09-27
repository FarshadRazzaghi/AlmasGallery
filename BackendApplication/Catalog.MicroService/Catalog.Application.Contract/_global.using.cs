global using Catalog.Domain.Model;
global using Catalog.Application.Model;

using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Catalog.Common.DependencyInjection")]
[assembly: InternalsVisibleTo("Catalog.Application.Business")]
[assembly: InternalsVisibleTo("Catalog.Infrastructure.Repository")]
namespace Catalog.Application.Contract;