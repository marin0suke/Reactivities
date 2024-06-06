using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<Activity>>> {} // 105. error handling part 3: bring in result obj

        public class Handler : IRequestHandler<Query, Result<List<Activity>>> // 105. here too
        {
             private readonly DataContext _context;
            public Handler(DataContext context) 
            {
                _context = context;    
            }
            public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken token) // 105. here too
            {
                return Result<List<Activity>>.Success(await _context.Activities.ToListAsync()); // 105. instead of returning the 
            }
        }
    }
}