import { Body, Controller, DefaultValuePipe, Get, ParseBoolPipe, ParseIntPipe, Post, Query, Req, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/filters/httpexception.filter';

@UseFilters(HttpExceptionFilter)  // controller scope 
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Query("isOnline",new ParseBoolPipe({
    optional: true
  })) isOnline : boolean , @Query("page",new DefaultValuePipe(1),ParseIntPipe) page :number): string {
    return this.appService.getHello(isOnline,page);
  }

  @Post("hello")
  @UseFilters(HttpExceptionFilter) // method scope
  postHello(@Body() data: any) {
    return this.appService.PostHello(data);
  }
}
