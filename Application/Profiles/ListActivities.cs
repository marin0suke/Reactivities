using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities // our  handler
    {
        public class Query : IRequest<Result<List<UserActivityDto>>> // query since we are retrieving data. no pagination to keep simple. normal list. 
        {
            public string Username { get; set; } // username of the user whose events we want to retrieve.
            public string Predicate { get; set; } // predicate to determine whether we are retrieving past, future or user-hosted events.
        }
        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            public Handler(DataContext context, IMapper mapper) // data context to retrieve from database. mapper to use ProjectTo function to go from activityattendee table to the useractivitydto.
            {
            _context = context;
            _mapper = mapper;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.ActivityAttendees // bc using mapper need to map from activity attendees obj.
                    .Where(u => u.AppUser.UserName == request.Username) // got event where usernames match with request.
                    .OrderBy(a => a.Activity.Date) // order by date.
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider) // 
                    .AsQueryable();

                query = request.Predicate switch // switch statement for changing what appears based on predicate.
                {
                    "past" => query.Where(a => a.Date <= DateTime.Now), // only past events.
                    "hosting" => query.Where(a => a.HostUsername == request.Username), // only where user is host
                    _ => query.Where(a => a.Date >= DateTime.Now) // default - all future activities.
                };

                var activities = await query.ToListAsync(); // database interction batch.

                return Result<List<UserActivityDto>>.Success(activities); // return the object!
            }
        }
    }
}

// 247 challenge. new class - handler. we want to return a list of activities based on a predicate and the username
// of the user whose profile we are looking at.