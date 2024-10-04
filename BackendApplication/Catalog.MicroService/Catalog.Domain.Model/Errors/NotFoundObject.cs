using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.Domain.Models.Errors;

public partial class NotFoundError : ProblemDetails
{
    public NotFoundError()
    {
        Status = StatusCodes.Status404NotFound;
        Title = "Not Found";
        Type = "Not Found";
        Detail = "Entity by selected filter not found.";
    }
}
