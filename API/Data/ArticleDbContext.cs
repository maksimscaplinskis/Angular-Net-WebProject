using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ArticleDbContext : DbContext
    {
        public ArticleDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Article> Articles { get; set; }
    }
}
