import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  async create(name: string) {
    return await this.prisma.categories.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
    });
  }

  async findAll() {
    return {
      categories: await this.prisma.categories.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    };
  }

  async findAllArticles(nameCategory: CreateCategoryDto) {
    return {
      articles: await this.prisma.categories.findMany({
        where: {
          name: nameCategory.name,
        },
        include: {
          article: true,
        },
      }),
    };
  }
}
