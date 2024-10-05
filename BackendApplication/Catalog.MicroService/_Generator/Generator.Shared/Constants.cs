namespace Generator.Shared;

internal class Constants
{
    #region DomainModel
    internal const string DomainModelLibraryName = "Catalog.Domain.Model";

    internal static readonly string[] DomainModelNamespaces = ["Catalog.Domain.Models"];
    internal static readonly string[] DomainModelExcludedSymbols = ["IBaseEntity"];
    #endregion DomainModel

    #region Infrastructure
    internal const string InfrastructureRepositoryLibraryName = "Catalog.Infrastructure.Repository";
    internal const string InfrastructureRepositoryNamespace = "Catalog.Infrastructure.Repository";
    internal const string InfrastructureUnitOfWorkNamespace = "Catalog.Infrastructure.Repository";
    #endregion Infrastructure

    #region Application
    internal const string ApplicationContractLibraryName = "Catalog.Application.Contract";
    internal const string ApplicationRepositoryNamespace = "Catalog.Application.Contract.Persistence";
    internal const string ApplicationUseCaseNamespace = "Catalog.Application.Contract.UseCase";
    internal const string ApplicationBusinessUseCaseNamespace = "Catalog.Application.Business.UseCase";
    #endregion Application

    #region String
    internal const string DbContextClassName = "AlmasGalleryContext";
    internal const string BaseRepositoryClassName = "BaseRepository";
    internal const string BaseUseCaseClassName = "BaseUseCase";
    internal const string UnitOfWorkClassName = "UnitOfWork";

    internal const string RepositoryPostfix = "Repository";
    internal const string UseCasePostfix = "UseCase";
    #endregion String
}
