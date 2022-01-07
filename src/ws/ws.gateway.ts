import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { RoomService } from 'src/room/room.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { wsUserId } from './ws.decorator';

interface callBody {
  event: string;
  data: any;
}

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'base',
})
export class WsGateway {
  constructor(
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private readonly restaurantService: RestaurantService,
  ) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('연결', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log(`연결 해제  : ${client.id}`);
  }

  @SubscribeMessage('update')
  updateEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log(data);

    client.broadcast.emit('update', data);
  }

  @SubscribeMessage('call')
  async addEvent(
    @wsUserId() userId: Number,
    @ConnectedSocket() client: Socket,
    @MessageBody() body: callBody,
  ): Promise<any> {
    if (!userId) {
      client.emit('error', 'token값이 일치하지 않습니다. 연결 해제 시킵니다.');
      client.disconnect();
      return new Error('unauthorized event');
    }

    const { event, data: bodyData } = body;
    const user: User = await this.userService.findById(+userId);

    const data = {
      userName: user.username,
      data: JSON.stringify(bodyData),
    };

    client.broadcast.emit(event, {
      data,
    });
  }
}
