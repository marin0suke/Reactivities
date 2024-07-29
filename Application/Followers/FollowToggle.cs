using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; } // we need to know the target user that current user is attempting to follow.

        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
            _userAccessor = userAccessor;
            _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername()); // user obj that will follow another user.
                var target = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername); // user obj that will be followed.

                if (target == null) return null; // check that above two attempts to get user obj were successful. 

                var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id); // attempt to get a following from the db.

                if (following == null) // if the following doesn't exist.
                {
                    following = new UserFollowing // if null create a new following entity.
                    {
                        Observer = observer, // observer and target here in Follow Toggle match what they are called in the UserFollowing Entity.
                        Target = target
                    };

                    _context.UserFollowings.Add(following); // then we add in the UserFollowing.
                }
                else // if there is a following, we want to toggle it off. remove following.
                {
                    _context.UserFollowings.Remove(following);
                }

                var success = await _context.SaveChangesAsync() > 0; // save changes to the db.

                if (success) return Result<Unit>.Success(Unit.Value); // return result obj. if success.

                return Result<Unit>.Failure("Failed to update following"); // return failure result obj if failed. and message.
            }
        }
    }
}

// 223. adding a handler for following. Command class - not returning data from this. we are updating the database.
// 