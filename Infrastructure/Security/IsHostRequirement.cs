using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
        // no props needed
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsHostRequirementHandler(DataContext dbContext, 
            IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier); // 165. bc we want to use the user's ID in this case. since the activityattendee table is made up of primary keys that are the user ID and activity ID combined: and query will be more efficient if we find the activity by its primary key.   

            if (userId == null) return Task.CompletedTask; // in other words, user is not authorised. they will not meet req.

            var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value?.ToString());
            // the act id is a Guid but in the routes value this is string. turn our Guid string into Guid obj, get Guid from system, and parse 

            var attendee = _dbContext.ActivityAttendees
                .AsNoTracking() // 166. resolving edit handler bug. (AsNoTracking doesn't work with FindAsync)
                .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId) // 166. resolving bug with edit handler.
                .Result; // 165. we can't use await inside here bc this is an override Task. use .Result to get.
        
            if (attendee == null) return Task.CompletedTask; // if no attendee. 

            if (attendee.IsHost) context.Succeed(requirement);
            //check to see if attendee is the host.

            return Task.CompletedTask; // if we get to this point and the Succeed flag is set, then user will be authorised to edit the activity.

        }
    }
}

// 165. adding custom auth policy. (host access to activities only)
// abstract method - gives us override method to handle this requirement. 