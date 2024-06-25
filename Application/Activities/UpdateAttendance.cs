using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }

        }

        public class Handler : IRequestHandler<Command, Result<Unit>> // 164. quick fix implement interface on IRequestHandler to get block below.
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor) // 164. quick fix add constructor from Handler. we need: the user making the request, 
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null) return null; // 164. check for activity - if null, 404 will be sent back to client.

                var user = await _context.Users.FirstOrDefaultAsync(x => 
                    x.UserName == _userAccessor.GetUsername()); // 164. we need to go get the user.

                if (user == null) return null; // 164. check to make sure we actually end up with a user after defining var user. 

                var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName; // 164. for convenience - save host name in a var. not async since we already have activity and attendees from dewfining var activity inside this Task. 

                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName); // attendees :)

                if (attendance != null && hostUsername == user.UserName) // 164 attendance status exists and host name is the username = Is the host, and we want to remove attendance for the host = cancel the activity.
                    activity.IsCancelled = !activity.IsCancelled; //  will set as a toggle. 

                if (attendance != null && hostUsername != user.UserName) // 164 attendance status exists and user is not the host: 
                    activity.Attendees.Remove(attendance); //  remove the user from attendance.

                if (attendance == null) // attendance status doesn't exist.
                {
                    attendance = new ActivityAttendee // set attendance status. set properties in a new attendee obj.
                    {
                        AppUser = user, 
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendance); // after creating obj, add to the attendance var. 
                }

                var result = await _context.SaveChangesAsync() > 0; // only saves when changes are made.

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance"); // 164. ternary to check if result is returned - success if yes, failure if no with message.

            }
        }
    }
}

// 164. adding attendance handler (new file) - attendee uses this to remove themselves from activity. if not going, will join them to activity. 
// if they're the host, they will be able to cancel the activity.
