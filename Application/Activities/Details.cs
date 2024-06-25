
using Domain;
using System;
using MediatR;
using Persistence;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<ActivityDto>> // 104. error handling. now returning Result of type Activity, not just an activity.
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ActivityDto>> // 104. need to add it here also
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper) // 163. configuring automapper profiles.
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken) // also here needed to add Result to Activity.
            {
                var activity = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider) // 163. automapper config for profiles. 
                    .FirstOrDefaultAsync(x => x.Id == request.Id);  // 104. - might need to go back and see what happened here. made activity a var here.

                return Result<ActivityDto>.Success(activity); // 104. and added the return statement to this new line - where we check for success (no failure yet)
            }
        }
    }
}

// 163. automapper - NOTE ProjectTo doesnt work with FindAsync. changed to FirstOrDefaultAsync here.