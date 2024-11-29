using Catalog.Domain.Model;
using Catalog.Domain.Model.Authentication;
using Catalog.Infrastructure.Repository;
using Microsoft.CodeAnalysis;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Catalog.Application.Business.UseCase;

internal partial class UserUseCase : IUserUseCase
{
    private readonly IOptions<AppSettings> options;

    public UserUseCase(IUserRepository userRepository,
                     IUnitOfWork unitOfWork,
                     IOptions<AppSettings> options)
        : this(userRepository, unitOfWork)
    {
        this.options = options;
    }

    private readonly User MockUser = new() { FirstName = "System", LastName = "System", IsActive = true, UserName = "System" };

    public async Task<User?> AddAndUpdateUserAsync(User userObj, CancellationToken cancellation = default)
    {
        bool isSuccess = false;
        if (userObj.Id > 0)
        {
            var obj = await Repository.GetSingleAsync(c => c.Id == userObj.Id, cancellation);
            if (obj != null)
            {
                // obj.Address = userObj.Address;
                obj.FirstName = userObj.FirstName;
                obj.LastName = userObj.LastName;
                Repository.Update(obj);
                await Repository.SaveChangesAsync(cancellation);
                isSuccess = true;
            }
        }
        else
        {
            Repository.Create(userObj);
            await Repository.SaveChangesAsync(cancellation);
            isSuccess = true;
        }

        return isSuccess ? userObj : null;
    }

    public async Task<User?> ValidateAndGetUserAsync(AuthenticateRequest model, CancellationToken cancellation = default)
    {
        return await Repository.GetSingleAsync(x => x.UserName == model.Username && x.Password == model.Password, cancellation) ?? MockUser;
    }

    public async Task<AuthenticateResponse?> AuthenticateAsync(AuthenticateRequest model, CancellationToken cancellation = default)
    {
        var user = await Repository.GetSingleAsync(x => x.UserName == model.Username && x.Password == model.Password, cancellation) ?? MockUser;
        if (user == null) return null;

        var token = await GenerateJwtToken(user, cancellation);
        return new AuthenticateResponse(token);
    }

    public async Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellation = default)
        => (await Repository.GetListAsNoTrackingAsync(cancellation)).Where(x => x.IsActive == true);

    public async Task<User?> GetByIdAsync(int id, CancellationToken cancellation = default)
        => await Repository.GetSingleAsync(x => x.Id == id, cancellation) ?? MockUser;

    private async Task<string> GenerateJwtToken(User user, CancellationToken cancellation)
    {
        //Generate token that is valid for 7 days
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = await Task.Run(() =>
        {
            var key = Encoding.ASCII.GetBytes(options.Value.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity([new Claim("id", user.Id.ToString())]),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            return tokenHandler.CreateToken(tokenDescriptor);
        }, cancellation);

        return tokenHandler.WriteToken(token);
    }
}
