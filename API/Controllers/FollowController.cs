using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpPost("{username}")]
        public async Task<IActionResult> Follow(string username)
        {
            return HandleResult(await Mediator.Send(new FollowToggle.Command{TargetUsername = username}));
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetFollowings(string username, string predicate) // 2 strings but one is coming from route param and one is coming from query string. so they don't need to be wrapped inside obj.
        {
            return HandleResult(await Mediator.Send(new List.Query{Username = username, Predicate = predicate}));
        }
    }
}

// 224. adding controller - endpoint.
// 226. return a list of followers - add httpget endpoint. 