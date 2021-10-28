import { Body, Controller, Get, Param, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('parms/:name')
  getNameParms(
    @Body() body: any,
    @Param() parms: any,
    @Request() req: Request,
  ): string {
    console.log(body, parms);

    return this.appService.getHello();
  }
}
