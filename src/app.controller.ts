import { Body, Controller, Get, Param, Req, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('login')
  login(@Body() body: any, @Request() req: Request) {
    // Basic auth 처리
    //@ts-ignore
    const base64Data = req.headers.authorization.split(' ')[1];
    const detail = Buffer.from(base64Data, 'base64').toString('ascii');
    const data = detail.split(':');
    const [username, password] = data;
    console.log(data);
    console.log(username, password);

    return {
      ok: true,
      token: 'login-TOken',
    };
  }

  @Get('auth/:name')
  getNameParms(
    @Body() body: any,
    @Param() parms: any,
    @Request() req: Request,
  ): string {
    console.log(body, parms);

    //@ts-ignore
    const [type, token] = req.headers.authorization.split(' ');

    if (type !== 'Bearer') return '타입이 다릅니다';

    // 유저 찾기
    const bol = Boolean(token);
    console.log('token : ', token);

    if (!bol) {
      return '존재 하지 않는 유저입니다.';
    }

    return this.appService.getHello();
  }
}
