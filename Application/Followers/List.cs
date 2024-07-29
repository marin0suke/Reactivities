using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; } // what do we want to return - followers or followings?
            public string Username { get; set; } // route parameter so we have access to the user we are interested in.
        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
            _userAccessor = userAccessor;
            _mapper = mapper;
            _context = context;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>(); // storage of the list returned.

                switch (request.Predicate)
                {
                    case "followers": // gives a list of the profiles from target to observer. 
                        profiles = await _context.UserFollowings.Where(x => x.Target.UserName == request.Username)
                            .Select(u => u.Observer)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                                new {currentUsername = _userAccessor.GetUsername()}) // 227. added param to match current to userAccessor.
                            .ToListAsync();
                        break;
                    case "following": // gives a list of the profiles from observer to target. 
                        profiles = await _context.UserFollowings.Where(x => x.Observer.UserName == request.Username)
                            .Select(u => u.Target)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                                new {currentUsername = _userAccessor.GetUsername()}) // 227. added getusername.
                            .ToListAsync();
                        break;
                }

                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}

// 226. return a list of followers. specified Profiles.Profile since using AutoMapper here and need to be more specific so there is no naming conflict.
// here we need to return a list of profiles based on whether or not this is a list of a user thats following a user or being followed by a user. 
// a bit trickier than logic we have previously built.
// 