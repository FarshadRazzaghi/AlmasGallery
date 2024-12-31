using Catalog.Domain.Model.Authentication;

namespace Catalog.Application.Contract.UseCase;

public partial interface IUserUseCase
{
    Task<User?> ValidateAndGetUserAsync(AuthenticateRequest model, CancellationToken cancellation = default!);
}
