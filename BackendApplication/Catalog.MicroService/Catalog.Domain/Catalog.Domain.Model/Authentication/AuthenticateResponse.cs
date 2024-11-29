namespace Catalog.Domain.Model.Authentication;

public class AuthenticateResponse(string token)
{
    public string Token { get; set; } = token;
}