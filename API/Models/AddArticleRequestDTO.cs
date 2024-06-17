namespace API.Models
{
    public class AddArticleRequestDTO
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public DateOnly Date { get; set; }
        public required string Type { get; set; }
    }
}
