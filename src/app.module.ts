import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards';
import { UserExistsRule } from './helper/validator';
import { ScrapperModule } from './scrapper/scrapper.module';
import { CategoriesModule } from './categories/categories.module';
import { ArticlesModule } from './articles/articles.module';
import { ArticleCategoriesModule } from './article-categories/article-categories.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot(),
    ScrapperModule,
    CategoriesModule,
    ArticlesModule,
    ArticleCategoriesModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    UserExistsRule,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
