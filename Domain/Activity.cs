namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }

        // [Required]
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }  
        public string City { get; set; }
        public string Venue { get; set; }
        public bool IsCancelled { get; set; } // 164. adding the attendance handler. giving host ability to cancel event.
        public ICollection<ActivityAttendee> Attendees { get; set; } = new List<ActivityAttendee>();
    }
}

// 101. validation with data annotations - added [Required] data annotations - makes title required.
// BUT argument for not having validation here in the domain layer. should be in the application layer.
// so will comment out the [Required] but leave comment there for study.

// 157. config relationships - changed ICollection specification to the new join table. 
// 160. testing create activity. adding empty collection of attendees so that it isn't null. when returning list of activities.