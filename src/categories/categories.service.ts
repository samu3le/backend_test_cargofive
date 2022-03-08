import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async findByName(name: string) {
    const category = await this.prisma.categories.findUnique({
      where: { name: name },
    });

    if (!category) {
      return false;
    }
    return category;
  }
}
