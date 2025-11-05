using Microsoft.EntityFrameworkCore;
using TaskManager.Models;

namespace TaskManager.Data
{

    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { } 

        public DbSet<User> Users => Set<User>();
        public DbSet<TaskItem> Tasks => Set<TaskItem>();


        protected override void OnModelCreating(ModelBuilder modelBuilder) // Configure entity relationships and constraints
        {
            base.OnModelCreating(modelBuilder); // Call base method

            modelBuilder.Entity<User>(entity => // Configure User entity
            {
                entity.HasKey(e => e.Id); 
                entity.Property(e => e.Email).IsRequired(); // Ensure Email is required
                entity.Property(e => e.PasswordHash).IsRequired(); 
            });

            modelBuilder.Entity<TaskItem>(entity => 
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired(); 
                entity.HasOne(e => e.User) 
                      .WithMany(u => u.Tasks)
                      .HasForeignKey(e => e.UserId) 
                      .OnDelete(DeleteBehavior.Cascade); // Delete tasks if user deleted
            });
        }
    }
}

