import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('push')
  async pushNotification(@Body() data: any) {
    return await this.notificationService.pushNotification(data);
  }

  @Post('register')
  async registerEndPoint(@Body() data: any) {
    return await this.notificationService.registerEndPoint(data);
  }
  @Delete(':auth')
  async deleteEndPoint(@Param() { auth }: any) {
    // 삭제할 조건 변경 & entitiy 데이터 추가
    //  (ex 유저 데이터 , endPoint 데이터중 auth 값 )

    return await this.notificationService.deleteEndPoint(auth);
  }
}
