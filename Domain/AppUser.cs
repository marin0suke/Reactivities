using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser 
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<ActivityAttendee> Activities { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public ICollection<UserFollowing> Followings { get; set; } // who the current user is following.
        public ICollection<UserFollowing> Followers { get; set; } // who is following current user.
    }
}


// 128. adding a user entity. 
// 129. 
// 157. config relationships - changed ICollection specification to the new join table. 
// 182. adding another prop - ICollection<Photo> Photos. 

// 222. new UserFollowing entity created in Domain, now adding here to AppUser entity.