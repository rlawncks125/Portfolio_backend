import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtMiddleware } from './JwtMiddleware/Jwt.middleware';

import { UserModule } from './user/user.module';
import { WsModule } from './ws/ws.module';
import { RoomModule } from './room/room.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { SubwayModule } from './subway/subway.module';
import { NotificationModule } from './notification/notification.module';
import { ShopUserModule } from './shop-user/shop-user.module';
import { MailerModule } from './mailer/mailer.module';
import { ShopItemModule } from './shop-item/shop-item.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      host: process.env.DB_HOST + '',
      port: +process.env.DB_PORT,
      database: process.env.DB_DATABASE + '',
      type: process.env.DB_TYPE as any,
      username: process.env.DB_ROOT + '',
      password: process.env.DB_PASSWORD + '',

      // postgres DB 호스팅 사용시 에러
      entities: [`dist/**/*.entity{ .ts,.js}`],

      synchronize: process.env.NODE_ENV === 'production' ? false : true,
      logger: 'simple-console',
    }),
    ScheduleModule.forRoot(),
    UserModule,
    WsModule,
    RoomModule,
    RestaurantModule,
    SubwayModule,
    NotificationModule,
    ShopUserModule,
    MailerModule,
    ShopItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
