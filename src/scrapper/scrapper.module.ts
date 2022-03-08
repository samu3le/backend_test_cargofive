import { Module } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { ScrapperController } from './scrapper.controller';
import { ArticlesService } from '../articles/articles.service';
import { CategoriesService } from '../categories/categories.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleCategoriesService } from '../article-categories/article-categories.service';

@Module({
  controllers: [ScrapperController],
  providers: [
    ScrapperService,
    ArticlesService,
    CategoriesService,
    PrismaService,
    ArticleCategoriesService,
  ],
})
export class ScrapperModule { }
