using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.Domain.Models.Errors;

public partial class BadRequestError : ProblemDetails
{
    public BadRequestError()
    {
        Status = StatusCodes.Status400BadRequest;
        Title = "Bad Request";
        Type = "Bad Request";
        Detail = "Model passed to request as POST is invalid object.";
    }
}
