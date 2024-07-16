using Application.Activities;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;
using Details = Application.Profiles.Details; // added by me. 

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Username = username}));
        }

        [HttpPut] // 207. section 18 challenge - put request for updating profile. 

        public async Task<IActionResult> EditProfile(EditProfile.Command command) // name of the class we want to implement, and the param is a command that is in that class. 
        {
            return HandleResult(await Mediator.Send(command)); // Send command - mediator. sends the command to the Handler. 
        }
        
    }
}

// 187. returning user profiles. 
// 188. tried to test in postman to get Profile, but had an ambiguous reference error for Details. 
// since we have details handler in activities in application too. so added using statement at top to specify details from profiles. 
// 