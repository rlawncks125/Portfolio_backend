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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(process.env.NODE_ENV === 'production'
        ? // heroku 배포시 url을 사용하여 연결
          {
            url: process.env.DATABASE_URL,
            // heroku error
            // self signed sertificate
            extra: {
              ssl: { rejectUnauthorized: false },
            },
          }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_ROOT,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
          }),
      type: process.env.DB_TYPE as any,
      entities: [`dist/**/*.entity{ .ts,.js}`],
      synchronize: process.env.NODE_ENV === 'production' ? false : true,
    }),
    UserModule,
    WsModule,
    RoomModule,
    RestaurantModule,
    SubwayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
