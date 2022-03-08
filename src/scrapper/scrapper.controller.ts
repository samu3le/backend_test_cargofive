import { Controller, Get } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators';

@Public()
@Controller('scrapper')
@ApiTags('scrapper')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) { }

  @Get()
  scrapperControlText() {
    return this.scrapperService.getData('innovacion');
  }
}
