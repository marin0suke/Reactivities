using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class EditProfile
    {
        public class Command : IRequest<Result<Unit>> // specify that EditProfile will be a Command class that derives? inherits? from IRequest (MediatR) that expects a Result object back, but nothing in it actually. 
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command> //  bring in Fluent Validation.  
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty(); // validates against display name. must have one.
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>> // must bring in Handler since this class is a Command.
        {
        private readonly DataContext _context; // initialise field from param in Handler.
        private readonly IUserAccessor _userAccessor; // initialise field from param in Handler.
            public Handler(DataContext context, IUserAccessor userAccessor) // generate ctor from Handler. then add namespaces + types that we need. 
            {
            _userAccessor = userAccessor;
            _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken) // implement interface on Handler. Result<Unit> is likely a custom type that encapsulates the outcome of the operation, where Unit is a value signaling the absence of a specific return value (commonly used in functional programming and libraries like MediatR to indicate "void" but in a way that supports fluent interfaces and chaining)
            //Command request is the param that carries info. 
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername()); // typical eg of querying a database using EF Core asynchronously. to fetch a single user entity based on a username. 

                user.Bio = request.Bio ?? user.Bio; // assigns a new value to user.Bio from request.Bio unless request.Bio is null, in which case it retains the original value of user.Bio.
                user.DisplayName = request.DisplayName ?? user.DisplayName; // same as above line.

                var success = await _context.SaveChangesAsync() > 0; // commit any changes tracked by EF data context, to the underlying database.

                if (success) return Result<Unit>.Success(Unit.Value); // checks the boolean value stored in success var. if true, returns empty success result.

                return Result<Unit>.Failure("Problem updating profile"); // otherwise - returns failure result with message.
            }
        }

    }
}


// 207. section 18 challenge. adding edit profile handler solo.
