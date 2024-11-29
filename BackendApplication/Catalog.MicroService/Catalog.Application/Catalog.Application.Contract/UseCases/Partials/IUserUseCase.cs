using Catalog.Domain.Model.Authentication;

namespace Catalog.Application.Contract.UseCase;

public partial interface IUserUseCase
{
    Task<AuthenticateResponse?> AuthenticateAsync(AuthenticateRequest model, CancellationToken cancellation = default!);
    Task<User?> ValidateAndGetUserAsync(AuthenticateRequest model, CancellationToken cancellation = default!);
    Task<User?> GetByIdAsync(int id, CancellationToken cancellation = default!);
    Task<User?> AddAndUpdateUserAsync(User userObj, CancellationToken cancellation = default!);
    Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellation = default!);
}
