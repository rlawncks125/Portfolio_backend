import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { WsGateway } from './ws.gateway';

@Module({
  imports: [UserModule],
  providers: [WsGateway],
})
export class WsModule {}
