import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ArticleCategoriesService } from 'src/article-categories/article-categories.service';
import { ArticlesService } from 'src/articles/articles.service';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ScrapperService {
  constructor(
    private categoriesService: CategoriesService,
    private articlesService: ArticlesService,
    private articleCategoryService: ArticleCategoriesService,
  ) { }

  async getArticle(page, url) {
    await page.goto(url, { waitUntil: 'networkidle2' });
    const article_data = await page.evaluate(() => {
      const title = document.querySelector('.inner-wrap > h1');
      const author = document.querySelector('.fn > a');
      const published_at = document.querySelector('.meta-date');
      const category_list = [];
      document.querySelectorAll('.meta-category').forEach((category) => {
        const category_name = category.querySelector('a').textContent;
        category_list.push(category_name);
      });
      console.log(url, 'url getArticle');
      return {
        title: title?.textContent,
        description: '',
        author: author?.textContent,
        published_at: published_at?.textContent,
        category: category_list,
        source: '',
      };
    });
    return article_data;
  }

  async saveRegisters(articles) {
    for (const article of articles) {
      const articleInsert = await this.articlesService.create(article);
      if (!articleInsert) return false;
      for (const category of article['category']) {
        console.log(category, 'category');
        const categoryInsert = await this.categoriesService.create(category);
        if (!categoryInsert) return false;
        const findArticleCategory = await this.articleCategoryService.find(
          articleInsert.id,
          categoryInsert.id,
        );
        if (findArticleCategory == null) {
          await this.articleCategoryService.create(
            articleInsert.id,
            categoryInsert.id,
          );
        }
      }
    }
    return true;
  }

  async getData(category: string) {
    const URL = `https://cargofive.com/es/category/${category}/`;
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle2' });

    const results = await page.evaluate(() => {
      const propertyList = [];
      document.querySelectorAll('.post-content-wrap').forEach((link) => {
        const source = link.querySelector('a').getAttribute('href');
        const description = link.querySelector('.post-content-wrap > .excerpt')?.textContent;
        const data = {
          source,
          description,
        };
        propertyList.push(data);
      });
      return propertyList;
    });

    const articles = [];
    for (let index = 0; index < 3; index++) {
      const article = results[index];
      const articleData = await this.getArticle(page, article['source']);
      articleData['description'] = article['description'];
      articleData['source'] = article['source'];
      articles.push(articleData);
    }
    console.log('getDataViaPuppeteer results :', articles);
    await browser.close();

    const saveData = this.saveRegisters(articles);
    return articles;
  }
}
