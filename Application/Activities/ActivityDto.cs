using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles;

namespace Application.Activities
{
    public class ActivityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }  
        public string City { get; set; }
        public string Venue { get; set; }
        public string HostUsername { get; set; } // 162. returning the profile alone won't give us host details. so we add this.
        public bool IsCancelled { get; set; } // 164. adding the attendance handler. giving host ability to cancel event.
        public ICollection<Profile> Attendees { get; set; } // 162. we grab the profile class.
    }
}

// 162. shaping the related data. - new dto file. copy pasted props from Activity.cs. 