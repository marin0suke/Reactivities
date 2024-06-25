using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> {} // 105. error handling part 3: bring in result obj // 162. changed to ActivityDto from Activity.

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>> // 105. here too // 162. activityDto instead of activity.
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper) // 162. added IMapper. (turning activity entity to activity dto here)
            {
            _mapper = mapper;
                _context = context;    
            }
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken token) // 105. here too
            {
                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider) // 163. replaced Include with ProjectTo. (switching from eager loading).
                    .ToListAsync(); // 161. loading related data - eagerly loading (use of include method) to get our attendee data (from the join table)

                return Result<List<ActivityDto>>.Success(activities); // 105. instead of returning the  // 161. returned activities inside Success method.
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