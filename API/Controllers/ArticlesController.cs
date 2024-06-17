using API.Data;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : ControllerBase
    {
        private readonly ArticleDbContext dbContext;
        public ArticlesController(ArticleDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetAllArticles()
        {
            var articles = dbContext.Articles.ToList();
            return Ok(articles);
        }

        [HttpPost]
        public IActionResult AddArticle(AddArticleRequestDTO request)
        {
            var domainModelArticle = new Article
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Description = request.Description,
                Date = request.Date,
                Type = request.Type,
            };

            dbContext.Articles.Add(domainModelArticle);
            dbContext.SaveChanges();

            return Ok(domainModelArticle);
        }
    }
}
