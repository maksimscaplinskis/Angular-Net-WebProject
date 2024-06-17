namespace API.Models
{
    public class Article
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public DateOnly Date { get; set; }
        public required string Type { get; set; }
    }
}
