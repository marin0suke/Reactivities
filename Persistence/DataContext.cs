using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

         public DbSet<Activity> Activities { get; set; }
         public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
         public DbSet<Photo> Photos { get; set; } // 182. adding photo entity.
         public DbSet<Comment> Comments { get; set; } // 209. we want to add a new dbset prop for this since we want to query the comments directly. and we aren't going to return with out activity.


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new {aa.AppUserId, aa.ActivityId})); // 157. this wil form the primary key in our join table.

            builder.Entity<ActivityAttendee>() 
                .HasOne(u => u.AppUser)
                .WithMany(a => a.Activities)
                .HasForeignKey(aa => aa.AppUserId);

            builder.Entity<ActivityAttendee>() 
                .HasOne(u => u.Activity)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.ActivityId);

            builder.Entity<Comment>() // 209.
                .HasOne(a => a.Activity) // one link with activity
                .WithMany(c => c.Comments) // 
                .OnDelete(DeleteBehavior.Cascade); // if del act, will cascade down to delete to comm assc. with act.
        }
    }
}


// 129. changed DbContext to IdentityDbContext<AppUser>
// 157. 2 things - added another DbSet and spec ActivityAttendee and called it ActivityAttendees (this one is new name).
// first protected override void - this is our config for many to many relationship.