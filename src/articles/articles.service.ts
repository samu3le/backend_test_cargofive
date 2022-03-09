import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
