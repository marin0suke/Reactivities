using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class ActivitiesController : BaseApiController
    {
        [HttpGet] //api/activities
        public async Task<IActionResult> GetActivities() // 105. change to IActionRsult - no need to specify type information
        {
            return HandleResult(await Mediator.Send(new List.Query())); // 105. instead of returning directly, we call the function and pass in the request to MediatR.
        }


        [HttpGet("{id}")] //api/activities/guid-whateveritis
        public async Task<IActionResult> GetActivity(Guid id) // 104. error handling - changed from ActionResult - activity, to IActionResult. 
        {
            return HandleResult(await Mediator.Send(new Details.Query{Id = id})); // 104. moved logic into BaseAPIcontroller so just returning here.
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command {Activity = activity})); // 105. added HandleResult
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id})); // 106. refactor with HandleResult

        }
    }
}

// 144. creating a login form - added allowanonymous at top so we can access activities (before this we turned on all authentication)