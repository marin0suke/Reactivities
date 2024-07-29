using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class AttendeeDto
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
        public bool Following { get; set; } // 228.
        public int FollowersCount { get; set; } // 228.
        public int FollowingCount { get; set; } // 228.
    }
}

// 189. returning an attendee dto. (copy pasted props from Profile.cs in profiles)

// 228. copied following/follower props from Profile class.