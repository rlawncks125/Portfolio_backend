import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, ShopAuthGuard } from 'src/auth/auth.guard';
import { Roles, ShopRoles } from 'src/auth/roles.decorator';
import {
  ClearRegisterInputDto,
  ClearRegisterOutPutDto,
} from './dtos/clear-subscription.dto';
import {
  ClearRegisterUserInputDto,
  ClearRegisterUserOutPutDto,
} from './dtos/clear-user.dto';
import {
  PatchListerNotificationInputDto,
  PatchListerNotificationOutPutDto,
} from './dtos/patchListerNotification.dto';
import {
  RegistersubscriptionUserInputDto,
  RegistersubscriptionUserOutPutDto,
} from './dtos/register-user.dto';
import {
  RegistersubscriptionInputDto,
  RegistersubscriptionOutPutDto,
} from './dtos/register.dto';
import { NotificationPayLoad } from './entities/Notification.entity';
import { NotificationService } from './notification.service';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ShopRoles(['admin'])
  @UseGuards(ShopAuthGuard)
  @Post('push')
  async pushNotification(@Body() data: any) {
    return await this.notificationService.pushNotification(data);
  }

  @Post('push/user')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  async pushNotificationByUserId(
    @Body() { userId, data }: { userId: number; data: NotificationPayLoad },
  ) {
    return await this.notificationService.pushNotificationByUserId(
      userId,
      data,
    );
  }

  @Get('publicKey')
  async getPublickey() {
    return {
      key: process.env.WORKER_PUBLICKEY,
    };
  }

  @Get('ispush/:auth')
  async getIsPush(@Param() { auth }: { auth: string }) {
    return await this.notificationService.getIsPush(auth);
  }
  @Get('shopispush/:auth')
  async getShopIsPush(@Param() { auth }: { auth: string }) {
    return await this.notificationService.getShopIsPush(auth);
  }

  @ApiResponse({
    type: RegistersubscriptionOutPutDto,
    status: 200,
  })
  @Post('register')
  async registerSubscription(@Body() data: RegistersubscriptionInputDto) {
    return await this.notificationService.registersubscription(data);
  }

  @ApiResponse({
    type: RegistersubscriptionUserOutPutDto,
    status: 200,
  })
  @Post('register-user')
  async registerSubscriptionUser(
    @Body() data: RegistersubscriptionUserInputDto,
  ) {
    return await this.notificationService.registerSubscriptionUser(data);
  }
  @ApiResponse({
    type: RegistersubscriptionUserOutPutDto,
    status: 200,
  })
  @Post('register-shop-user')
  async registerSubscriptionShopUser(
    @Body() data: RegistersubscriptionUserInputDto,
  ) {
    return await this.notificationService.registerShopSubscriptionUser(data);
  }

  @ApiResponse({
    type: ClearRegisterUserOutPutDto,
    status: 200,
  })
  @Post('register-user-remove')
  async removeRegisterSubscriptionUser(
    @Body() data: ClearRegisterUserInputDto,
  ) {
    return await this.notificationService.removeRegisterSubscriptionUser(data);
  }

  @ApiResponse({
    type: ClearRegisterUserOutPutDto,
    status: 200,
  })
  @Post('register-shop-user-remove')
  async removeRegisterSubscriptionShopUser(
    @Body() data: ClearRegisterUserInputDto,
  ) {
    return await this.notificationService.removeRegisterShopSubscriptionUser(
      data,
    );
  }

  @ApiResponse({
    type: PatchListerNotificationOutPutDto,
    status: 200,
  })
  @Patch()
  async PatchListerNotification(@Body() data: PatchListerNotificationInputDto) {
    return await this.notificationService.patchListerNotification(data);
  }

  @ApiResponse({
    type: PatchListerNotificationOutPutDto,
    status: 200,
  })
  @Patch('/shop')
  async PatchListerShopNotification(
    @Body() data: PatchListerNotificationInputDto,
  ) {
    return await this.notificationService.patchListerShopNotification(data);
  }

  @ApiResponse({
    type: ClearRegisterOutPutDto,
    status: 200,
  })
  @Delete(':auth')
  async deletesubscription(@Param() { auth }: ClearRegisterInputDto) {
    //  endPoint 데이터중 auth 값
    return await this.notificationService.deletesubscription(auth);
  }
}
