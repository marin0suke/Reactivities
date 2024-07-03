using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    }
}

// 187. returning user profiles. 
// 188. tried to test in postman to get Profile, but had an ambiguous reference error for Details. 
// since we have details handler in activities in application too. so added using statement at top to specify details from profiles.