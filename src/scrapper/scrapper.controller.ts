import { Controller, Get, Body } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { ApiTags } from '@nestjs/swagger';
import { DataScrapperDto } from './dto/data-scrapper.dto';

@Controller('scrapper')
@ApiTags('scrapper')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) { }

  @Get()
  scrapperControlText(@Body() dataScraperDto: DataScrapperDto) {
    return this.scrapperService.getData(dataScraperDto);
  }
}
