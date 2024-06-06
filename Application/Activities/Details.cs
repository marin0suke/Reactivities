
using Domain;
using System;
using MediatR;
using Persistence;
using Application.Core;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<Activity>> // 104. error handling. now returning Result of type Activity, not just an activity.
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Activity>> // 104. need to add it here also
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
            _context = context;
            }

            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken) // also here needed to add Result to Activity.
            {
                var activity = await _context.Activities.FindAsync(request.Id);  // 104. - might need to go back and see what happened here. made activity a var here.

                return Result<Activity>.Success(activity); // 104. and added the return statement to this new line - where we check for success (no failure yet)
            }
        }
    }
}