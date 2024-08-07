using Domain;

namespace Application.Profiles
{
    public class Profile
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
        public bool Following { get; set; } // 225. shows if the currently logged in profile is following another profile. 
        public int FollowersCount { get; set; } // 225.
        public int FollowingCount { get; set; } // 225.

        public ICollection<Photo> Photos { get; set; }
        
    }
}

// 162. shaping the related data. 
// 187. returning user profiles. added ICollection prop for Photos. 
