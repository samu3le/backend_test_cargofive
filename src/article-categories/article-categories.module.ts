import { Module } from '@nestjs/common';
import { ArticleCategoriesService } from './article-categories.service';

@Module({
  providers: [ArticleCategoriesService],
})
export class ArticleCategoriesModule { }
