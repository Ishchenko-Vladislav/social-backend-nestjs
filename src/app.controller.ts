import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('search')
  search(
    @Query('searchTerm') searchTerm?: string,
    @Query('only') only?: string | undefined,
  ) {
    return this.appService.searchSomeone(searchTerm, only);
  }
}
