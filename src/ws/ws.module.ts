import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { WsGateway } from './ws.gateway';
import { WsController } from './ws.controller';

@Module({
  imports: [UserModule],
  providers: [WsGateway, ChatGateway],
  controllers: [WsController],
})
export class WsModule {}
