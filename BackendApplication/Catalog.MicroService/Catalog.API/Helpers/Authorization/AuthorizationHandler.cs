using System.Text;

namespace Catalog.API.Helpers.Authorization;

public class AuthorizationHandler(IServiceScopeFactory serviceScope) : AuthorizationHandler<AuthorizationRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, AuthorizationRequirement requirement)
    {
        if (context.Resource is not HttpContext httpContext)
        {
            throw new InvalidOperationException();
        }

        var authorization = httpContext.Request.Headers.Authorization.FirstOrDefault();
        if (string.IsNullOrEmpty(authorization))
        {
            throw new UnauthorizedAccessException();
        }

        await AttachUserToContext(authorization, httpContext);
        var user = (User?)httpContext.Items["User"];
        if (user == null)
        {
            throw new UnauthorizedAccessException();
        }
        else
        {
            context.Succeed(requirement);
        }
    }

    private async Task AttachUserToContext(string token, HttpContext httpContext)
    {
        try
        {
            token = token.Split(" ").Last();
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
            httpContext.Items["User"] = user;
        }
        catch
        {
        }
    }
}
