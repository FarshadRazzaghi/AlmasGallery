global using AlmasGallery.Catalog.Application.Models;
global using AlmasGallery.Catalog.Domain.Models;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Catalog.Common.DependencyInjection")]
[assembly: InternalsVisibleTo("Catalog.Application.Business")]
[assembly: InternalsVisibleTo("Catalog.Infrastructure.Repository")]
namespace AlmasGallery.Catalog.Application.Contract;