import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { PrismaService } from 'src/prisma/prisma.service';
import { DataScrapperDto } from './dto/data-scrapper.dto';

@Injectable()
export class ScrapperService {
  constructor(private prisma: PrismaService) { }

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
      const { title, published_at, author, source, description, category } =
        article;
      const categories = [];

      category.forEach((category_name) => {
        categories.push({
          create: { name: category_name },
          where: { name: category_name },
        });
      });
      const articleInsert = await this.prisma.articles.upsert({
        where: {
          title: title,
        },
        update: {},
        create: {
          title: title,
          published_at: published_at,
          author: author,
          source_link: source,
          body_description: description,
          category: {
            connectOrCreate: categories,
          },
        },
      });

      if (!articleInsert) return false;
    }
    return true;
  }

  async goToPage(URL, page) {
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

    const saveData = await this.saveRegisters(articles);
    return saveData;
  }

  async getData() {
    const category = ['logistica-internacional', 'innovacion'];

    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    let is_scrapped = true;
    for (const scraper of category) {
      const URL = `https://cargofive.com/es/category/${scraper}/`;
      is_scrapped = await this.goToPage(URL, page);
    }
    await browser.close();
    return {
      data: is_scrapped,
      message: `${is_scrapped ? 'Successfully' : 'Failure'} to Scrappe Articles`,
    };
  }
}
