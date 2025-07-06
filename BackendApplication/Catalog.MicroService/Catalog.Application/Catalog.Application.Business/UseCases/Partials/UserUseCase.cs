using AlmasGallery.Catalog.Domain.Model.Authentication;

namespace AlmasGallery.Catalog.Application.Business.UseCase;

internal partial class UserUseCase : IUserUseCase
{
    private readonly User MockUser = new() { FirstName = "System", LastName = "System", IsActive = true, UserName = "System" };

    public async Task<User?> ValidateAndGetUserAsync(AuthenticateRequest model, CancellationToken cancellation = default)
    {
        if (model.Username == "Farshad" && model.Password == "Pa$$w0rd")
        {
            return MockUser;
        }

        // TODO _ REMOVE MOCKUSER TO GET ONKY FROM DATABASE
        return await Repository.GetSingleAsync(x => x.UserName == model.Username && x.Password == model.Password, cancellation);
    }
}
