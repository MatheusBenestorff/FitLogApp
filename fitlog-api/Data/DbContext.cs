using Microsoft.EntityFrameworkCore;

namespace FitLogApp.api.Data;

public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

    }
