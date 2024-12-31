namespace Catalog.API.Helpers.Authorization;

public class AuthorizationRequirement(string condition) : IAuthorizationRequirement
{
    public string Condition { get; set; } = condition;
}
