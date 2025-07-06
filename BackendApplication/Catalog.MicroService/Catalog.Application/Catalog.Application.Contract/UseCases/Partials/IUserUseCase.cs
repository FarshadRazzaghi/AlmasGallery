using AlmasGallery.Catalog.Domain.Model.Authentication;

namespace AlmasGallery.Catalog.Application.Contract.UseCase;

public partial interface IUserUseCase
{
    Task<User?> ValidateAndGetUserAsync(AuthenticateRequest model, CancellationToken cancellation = default!);
}
