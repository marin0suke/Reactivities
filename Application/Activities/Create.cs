using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }   
        }

        // 102. fluent validation

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator() // 102. use ctor to create constructor. change create to the validator name and no need for params.
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator()); // 102 - changed this so it uses the new C# class we created - 
            }
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
                _context.Activities.Add(request.Activity);

                var result = await _context.SaveChangesAsync() > 0; // 105. change to var result, then check for over 0, (saveschangesasync returns an integer)

                if (!result) return Result<Unit>.Failure("Failed to create activity"); // 105. should return a 400 bad request

                return Result<Unit>.Success(Unit.Value); // 105. if successful, return result of type unit. efectively notifies our api controller that this was successful
            }


        }
    }
}