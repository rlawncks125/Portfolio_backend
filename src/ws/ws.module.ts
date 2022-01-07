import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { WsGateway } from './ws.gateway';
import { WsController } from './ws.controller';
import { RoomModule } from 'src/room/room.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [UserModule, RoomModule, RestaurantModule],
  providers: [WsGateway, ChatGateway],
  controllers: [WsController],
})
export class WsModule {}
