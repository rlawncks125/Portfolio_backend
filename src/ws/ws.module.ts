import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { WsGateway } from './ws.gateway';
import { RoomModule } from 'src/room/room.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { FoodMapChatGateway } from './foodMapChat.gateway';

import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [UserModule, RoomModule, RestaurantModule],
  providers: [FoodMapChatGateway],
  controllers: [],
})
export class WsModule {}
