global using AlmasGallery.Catalog.Application.Contract.Persistence;
global using AlmasGallery.Catalog.Domain.Models;
global using AlmasGallery.Catalog.Infrastructure.Persistence;

using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Catalog.Application.Business")]
[assembly: InternalsVisibleTo("Catalog.Common.DependencyInjection")]
namespace AlmasGallery.Catalog.Infrastructure.Repository;