using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected  IMediator Mediator => _mediator ??= 
            HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result == null) return NotFound(); // 106. error for delete - if activity doesn't exist then result is returned as null. 
            if (result.IsSuccess && result.Value != null) //104. adding if to check the result var.
                return Ok(result.Value);
            if (result.IsSuccess && result.Value == null) // if it is null, return notfound
                return NotFound();
            return BadRequest(result.Error); // 104. if neither above are returned, we know request was not successful - so return error.
        }
    }
}

// 101. the APIcontroller attribute on line 6 is doing magic - generates automatic http 400 responses if its encounters validation error.