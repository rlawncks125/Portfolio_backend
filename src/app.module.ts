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
import { User } from './user/entities/user.entity';
import { ShopUser } from './shop-user/entities/shop-user.entity';
import { ShopItem } from './shop-item/eitities/shop-item.entity';
import { ShopUserSeller } from './shop-user/entities/shop-user-seller.entity';
import { ShopIreceipt } from './shop-item/eitities/shop-ireceipt.entity';
import { ShopSoldItem } from './shop-item/eitities/shop-soldItem.entity';
import { Room } from './room/entities/room.entity';
import { Restaurant } from './restaurant/entities/restaurant.entity';
import { Comment } from './restaurant/entities/comment.entity';
import { Notification } from './notification/entities/Notification.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // url: 'postgresql://pg1101.gabiadb.com:5432/rlawncks',

      host: process.env.DB_HOST + '',
      port: +process.env.DB_PORT,
      database: process.env.DB_DATABASE + '',
      type: process.env.DB_TYPE as any,
      username: process.env.DB_ROOT + '',
      password: process.env.DB_PASSWORD + '',

      // ...(process.env.NODE_ENV === 'production'
      //   ? {
      //       extra: {
      //         ssl: { rejectUnauthorized: false },
      //       },
      //     }
      //   : {}),

      // postgres DB 호스팅 사용시 에러
      entities: [`dist/**/*.entity{ .ts,.js}`],

      synchronize: process.env.NODE_ENV === 'production' ? false : false,
      logger: 'simple-console',
    }),
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
