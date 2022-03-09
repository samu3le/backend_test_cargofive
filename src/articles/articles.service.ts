import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleDto } from './dto/article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return {
      articles: await this.prisma.articles.findMany({
        include: {
          category: true,
        },
      }),
    };
  }

  async findAllAuthors() {
    return {
      authors: await this.prisma.articles.findMany({
        select: {
          author: true,
        },
        distinct: ['author'],
      }),
    };
  }

  async findAllByAuthor(authorArticle: ArticleDto) {
    return {
      articles: await this.prisma.articles.findMany({
        where: {
          author: authorArticle.author,
        },
        include: {
          category: true,
        },
      }),
    };
  }
}
