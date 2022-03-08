import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) { }

  async create(data) {
    const { title, published_at, author, source, description } = data;
    return await this.prisma.articles.create({
      data: {
        title: title,
        published_at: published_at,
        author: author,
        source_link: source,
        body_description: description,
      },
    });
  }

  findAll() {
    return this.prisma.users.findMany();
  }
}
