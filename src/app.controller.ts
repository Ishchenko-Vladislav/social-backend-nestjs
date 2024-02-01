import { Controller, Get, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedRequest } from './auth/types/user.request';

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
  @Get('search-by')
  searchBy(
    @Req() req: AuthenticatedRequest,
    @Query('searchTerm') searchTerm?: string,
    @Query('only') only?: string | undefined,
    @Query('skip') skip?: string | undefined,
  ) {
    return this.appService.searchSomeoneBy(
      searchTerm,
      only,
      req.user.id,
      +skip ?? 0,
    );
  }
}
