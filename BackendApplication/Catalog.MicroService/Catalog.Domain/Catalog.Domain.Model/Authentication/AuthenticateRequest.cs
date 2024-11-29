using System.ComponentModel;

namespace Catalog.Domain.Model.Authentication;

public class AuthenticateRequest
{
    [DefaultValue("System")]
    public required string Username { get; set; }

    [DefaultValue("System")]
    public required string Password { get; set; }
}