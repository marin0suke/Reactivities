using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class UserActivityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }

        [JsonIgnore] // attribute if we dont want to return to client. 
        public string HostUsername { get; set; } // this will act as helper so we can fish out the filters for the act that the user is actually hosting. 
    }
}

// 247. user profile activities comp + challenge. 