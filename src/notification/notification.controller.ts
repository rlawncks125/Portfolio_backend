import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ShopAuthGuard } from 'src/auth/auth.guard';
import { ShopRoles } from 'src/auth/roles.decorator';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ShopRoles(['admin'])
  @UseGuards(ShopAuthGuard)
  @Post('push')
  async pushNotification(@Body() data: any) {
    return await this.notificationService.pushNotification(data);
  }

  @Get('publicKey')
  async getPublickey() {
    return {
      key: process.env.WORKER_PUBLICKEY,
    };
  }

  @Post('register')
  async registerEndPoint(@Body() data: any) {
    return await this.notificationService.registerEndPoint(data);
  }
  @Delete(':auth')
  async deleteEndPoint(@Param() { auth }: any) {
    //  endPoint 데이터중 auth 값
    return await this.notificationService.deleteEndPoint(auth);
  }
}
