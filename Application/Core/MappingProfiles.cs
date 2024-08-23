using Application.Activities;
using Application.Comments;
using Application.Profiles;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : AutoMapper.Profile // 247. had to specify automapper namespace to avoid conflicts due to needing to add a using statement for out profiles. 
    {
        public MappingProfiles()
        {
            string currentUsername = null; // 227. adding the following prop to the mapping config.
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>() // 162. shaping the related data. added. then in List.cs add IMapper. 
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees
                    .FirstOrDefault(x => x.IsHost).AppUser.UserName)); // 163. configuring automapper profiles.
            CreateMap<ActivityAttendee, AttendeeDto>() // 189. changed from Profiles.Profile to AttendeeDto. // 163. we got error - unable to map from ActivityAttendees to Profile. so needed to config that:
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count)) // 228. added. also have to specify from AppUser entity.
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.AppUser.Followings.Count)) // 228. added.
                .ForMember(d => d.Following, 
                    o => o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername))); // 228. added.
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count)) // 225. added.
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count)) // 225. added.
                .ForMember(d => d.Following, 
                    o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername))); // 227. added.
            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<ActivityAttendee, UserActivityDto>() // 247. bc using automapper for profile events tab, need to connect activity attendee to new useractivitydto. 
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Activity.Id))
                .ForMember(d => d.Date, o => o.MapFrom(s => s.Activity.Date))
                .ForMember(d => d.Title, o => o.MapFrom(s => s.Activity.Title))
                .ForMember(d => d.Category, o => o.MapFrom(s => s.Activity.Category))
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Activity.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName)); 
        }
    }
}


// 163. we needed a new map, bc our activitydto has an attendees prop, and what we need to map - is from our ActivityAttendee to our Profile obj. 
// 188. 
// 189. added grabbing image for map between ActivityAttendee and AttendeeDto.

// 210. adding comment dto and mapping. copy pasted ForMembers from activityattendee to attendeedto. del bio portion. 