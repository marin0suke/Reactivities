using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>> // 106. error response part 4
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator() // 102. use ctor to create constructor. change create to the validator name and no need for params.
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator()); // 102 - changed this so it uses the new C# class we created - 
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>> // 106. add result unit
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)

            {
            _mapper = mapper;
            _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken) // 106. add result unit
            {
                var activity = await _context.Activities.FindAsync(request.Activity.Id);

                if (activity == null) return null; // 106. same as other handlers - if no activity, return the same.

                _mapper.Map(request.Activity, activity);

                var result = await _context.SaveChangesAsync() > 0; // 106. same

                if (!result) return Result<Unit>.Failure("Failed to update activity");

                return Result<Unit>.Success(Unit.Value); 

            }
        }
    }
}