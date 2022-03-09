import { Body, Controller, Get, Post } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dto/article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get('authors')
  findAllAuthors() {
    return this.articlesService.findAllAuthors();
  }

  @Post('by_author')
  findAllByAuthor(@Body() articleDto: ArticleDto) {
    return this.articlesService.findAllByAuthor(articleDto);
  }
}
