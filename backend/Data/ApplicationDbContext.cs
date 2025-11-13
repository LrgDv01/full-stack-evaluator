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
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                // Improvement: Unique index prevents duplicate emails; supports fast lookups in auth flows
                entity.HasIndex(e => e.Email).IsUnique(); // Ensure unique emails
            });

            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200); // Fix: Match to 200 (or change attribute to match)
                // Index on UserId speeds up per-user queries, for example in (TasksController filters)
                entity.HasIndex(e => e.UserId); // Improvement: Index for faster joins/queries on UserId
                // Cascade delete for simplicity (tasks auto-remove on user delete);  Switch to Restrict if archiving needed
                entity.HasOne(e => e.User)
                      .WithMany(u => u.Tasks)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade); // Delete tasks if user deleted (keep if wanted; change to Restrict if not)
            });
        }
    }
}