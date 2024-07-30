using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDto>>> // 237. changing 4x List to PagedList. // 105. error handling part 3: bring in result obj // 162. changed to ActivityDto from Activity.
        { 
            public ActivityParams Params { get; set; } // 243. changed to new class ActivityParams for filtering props. 237. added PagingParams.
        } 
        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>> // 105. here too // 162. activityDto instead of activity.
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor) // 162. added IMapper. (turning activity entity to activity dto here)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;    
            }
            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken token) // 105. here too
            {
                var query = _context.Activities
                    .Where(d => d.Date >= request.Params.StartDate) // 243. adding in grabbing by start date. using new StartDate prop from ActivityParams class.
                    .OrderBy(d => d.Date) // 238. ensures activities are in date order.
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
                        new {currentUsername = _userAccessor.GetUsername()}) // 228. updated (more info below) // 163. replaced Include with ProjectTo. (switching from eager loading).
                    .AsQueryable(); // 237. as Queryable not an async method. expression tree. nothing is happening within the database in this method. // 161. loading related data - eagerly loading (use of include method) to get our attendee data (from the join table)

                if (request.Params.IsGoing && request.Params.IsHost) // 243. modifying query based on request parameters.
                {
                    query = query.Where(x => x.Attendees.Any(a => a.Username == _userAccessor.GetUsername())); // 243. if the isGoing and is NOT the host, 
                }

                if (request.Params.IsHost && !request.Params.IsGoing) // 243. not operator for the request parameter, not whether the user is going. 
                {
                    query = query.Where( x=> x.HostUsername == _userAccessor.GetUsername()); //  we have access to host username due to project to - we are dealing with an activityDto. 
                }

                return Result<PagedList<ActivityDto>>.Success( // 237. replace 'activities' in success param.  105. instead of returning the  // 161. returned activities inside Success method.
                    await PagedList<ActivityDto>.CreateAsync(query, request.Params.PageNumber, 
                        request.Params.PageSize) // here now we are returning a paged list of activities.
                ); 
            }
        }
    }
}

// 162. after updating the IRequest, IRequestHandler, and Task - to ActivityDto from Activity, we get an error since the Task returns list of activity entities, not activity dtos. 
// we can use automapper to create mapping prof. to go from act to act dto. 

// 163. in terminal, we have lots of properties we aren't using. query is messy. so instead of eager loading, will use projection. 
// we will use automapper extension that allows us to project to an entity or a class.
// when using projection, no need to eagerly load out related data. 
// ALSO ProjectTo means the var activities becomes an ActivityDto, so we no longer need to add mapping function and can return activities directly.

// 228. added IUserAccessor to get Username, so we can appropriately change props according to username.
// we have currentUsername string in MappingProfiles and we are defining it here through UserAccessor. through ProjectTo second parameter.