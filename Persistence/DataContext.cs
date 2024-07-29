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

         public DbSet<UserFollowing> UserFollowings { get; set; } // 222. adding a join entity.


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

            builder.Entity<UserFollowing>(b =>  // 222. config new entity relationship in OnModelCreating. UserFollowing entity reps the join table in a many to many rship between users where one follows another.
            {
                b.HasKey(k => new {k.ObserverId, k.TargetId}); //  sets a composite primary key using both ids. combo of both user ids ensures each followings id is unique.

                b.HasOne(o => o.Observer) // config current user side of relationship. HasOne specifies that each UserFollowing instance has one observer.
                    .WithMany(f => f.Followings) // indicates that one observer can follow many targets, linking this part of the rship to the Followings collection in the observer entity.
                    .HasForeignKey(o => o.ObserverId) // defines ObserverId as the foreign key in the UserFollowing table.
                    .OnDelete(DeleteBehavior.Cascade); // specifies that if a user is deleted, all related UserFollowing records (where they are the observer) should also be deleted.

                b.HasOne(o => o.Target) // config target side of relationship. HasOne = one target.
                    .WithMany(f => f.Followers) // one target can be followed by many observers.
                    .HasForeignKey(o => o.TargetId) // defines targetId as foreignkey in the userFollowing table.
                    .OnDelete(DeleteBehavior.Cascade); // if target is deleted, all related userFollowing records (where they are the target) are also deleted.
            });
        }
    }
}


// 129. changed DbContext to IdentityDbContext<AppUser>
// 157. 2 things - added another DbSet and spec ActivityAttendee and called it ActivityAttendees (this one is new name).
// first protected override void - this is our config for many to many relationship.