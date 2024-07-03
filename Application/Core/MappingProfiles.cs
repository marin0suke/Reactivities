using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>() // 162. shaping the related data. added. then in List.cs add IMapper. 
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees
                    .FirstOrDefault(x => x.IsHost).AppUser.UserName)); // 163. configuring automapper profiles.
            CreateMap<ActivityAttendee, AttendeeDto>() // 189. changed from Profiles.Profile to AttendeeDto. // 163. we got error - unable to map from ActivityAttendees to Profile. so needed to config that:
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}


// 163. we needed a new map, bc our activitydto has an attendees prop, and what we need to map - is from our ActivityAttendee to our Profile obj. 
// 188. 
// 189. added grabbing image for map between ActivityAttendee and AttendeeDto.