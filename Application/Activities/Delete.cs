
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>> // 106. error handling
        {
            public Guid Id { get; set; }
        }


        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
            _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                // if (activity == null) return null; // 106. adding conditional to see if activity exists

                _context.Remove(activity);

                var result = await _context.SaveChangesAsync() > 0; // 106. add result var and conditional

                if (!result) return Result<Unit>.Failure("Failed to delete the activity"); // 106. check if result obj failed - return message

                return Result<Unit>.Success(Unit.Value); //  106. if didn't fail, return success result obj. 
            }
        }


    }
}