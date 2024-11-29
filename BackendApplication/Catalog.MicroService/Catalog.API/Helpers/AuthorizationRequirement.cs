using Catalog.Application.Contract.UseCase;
using Catalog.Domain.Model;
using Catalog.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Catalog.API.Helpers;

public enum AuthenticationScheme : byte
{
    None = 0,
    Bearer = 1,
    Basic = 2,
}

public class AuthorizationRequirement : IAuthorizationRequirement { }

public class AuthorizationHandler(IHttpContextAccessor httpContextAccessor,
                               IServiceScopeFactory serviceScope,
                               IOptions<AppSettings> appSettings)
    : AuthorizationHandler<AuthorizationRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, AuthorizationRequirement requirement)
    {
        var authorization = httpContextAccessor.HttpContext!.Request.Headers.Authorization.FirstOrDefault();
        var schema = GetSchema(authorization);
        if (schema.authorization == null)
        {
            context.Fail();
            return;
        }

        await AttachUserToContext(schema.authorization, schema.schema);
        var user = (User?)httpContextAccessor.HttpContext!.Items["User"];
        if (user == null)
        {
            context.Fail();
            return;
        }
        else
        {
            context.Succeed(requirement);
        }
    }

    private static (string? authorization, AuthenticationScheme schema) GetSchema(string? authorization)
    {
        var schema = AuthenticationScheme.None;
        if (authorization == null)
        {
            return (null, schema);
        }

        if (authorization.StartsWith("Bearer"))
        {
            schema = AuthenticationScheme.Bearer;
        }
        else if (authorization.StartsWith("Basic"))
        {
            schema = AuthenticationScheme.Basic;
        }

        return (authorization.Split(" ").Last(), schema);
    }

    private async Task AttachUserToContext(string token, AuthenticationScheme schema)
    {
        try
        {
            switch (schema)
            {
                case AuthenticationScheme.Bearer:
                    {
                        var tokenHandler = new JwtSecurityTokenHandler();
                        var key = Encoding.ASCII.GetBytes(appSettings.Value.Secret);
                        var tokenValidation = new TokenValidationParameters
                        {
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(key),
                            ValidateIssuer = false,
                            ValidateAudience = false,
                            ClockSkew = TimeSpan.Zero
                        };
                        tokenHandler.ValidateToken(token, tokenValidation, out SecurityToken validatedToken);

                        var jwtToken = (JwtSecurityToken)validatedToken;
                        var userId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

                        var userUseCase = serviceScope.CreateScope().ServiceProvider.GetRequiredService<IUserUseCase>();
                        httpContextAccessor.HttpContext!.Items["User"] = await userUseCase.GetByIdAsync(userId);
                        break;
                    }

                case AuthenticationScheme.Basic:
                    {
                        var encoding = Encoding.GetEncoding("iso-8859-1");
                        var usernamePassword = encoding.GetString(Convert.FromBase64String(token));
                        var separatorIndex = usernamePassword.IndexOf(':');

                        var username = usernamePassword[..separatorIndex];
                        var password = usernamePassword[(separatorIndex + 1)..];
                        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                        {
                            throw new UnauthorizedAccessException();
                        }

                        var userUseCase = serviceScope.CreateScope().ServiceProvider.GetRequiredService<IUserUseCase>();
                        var user = await userUseCase.ValidateAndGetUserAsync(new Domain.Model.Authentication.AuthenticateRequest() { Password = password, Username = username });
                        httpContextAccessor.HttpContext!.Items["User"] = user;
                        break;
                    }

                default:
                    throw new NotSupportedException();
            }
        }
        catch
        {
        }
    }
}