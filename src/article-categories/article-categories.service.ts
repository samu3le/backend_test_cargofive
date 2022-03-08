import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticleCategoriesService {
  constructor(private prisma: PrismaService) { }

  create(id_article, id_category) {
    return this.prisma.article_categories.create({
      data: {
        id_article: id_article,
        id_category: id_category,
      },
    });
  }

  find(id_article, id_category) {
    return this.prisma.article_categories.findFirst({
      where: {
        id_article: id_article,
        AND: { id_category: id_category },
      },
    });
  }
}
