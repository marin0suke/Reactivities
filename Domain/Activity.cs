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
    }
}

// 101. validation with data annotations - added [Required] data annotations - makes title required.
// BUT argument for not having validation here in the domain layer. should be in the application layer.
// so will comment out the [Required] but leave comment there for study.