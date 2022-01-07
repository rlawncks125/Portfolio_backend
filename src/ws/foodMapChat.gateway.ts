// 소켓 반응 할거 목록
// - 유저 방 참가 알림 ( 바로 반영 )
// - 댓글 추가 알림 ( 새로 고침 알림 )
// - 레스토랑 추가 알림 ( 새로 고침 알림 )

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

export enum EventTriggerTypes {
  CREATEROOM = 'CREATEROOM',
  JOINUSER = 'JOINUSER',
  LEAVEROOM = 'LEAVEROOM',
}

// event인터페이스 필요없을거같음
type TEventTypes = keyof typeof EventTriggerTypes;

interface callBody {
  event: TEventTypes;
  data: any;
}

interface responeData {
  event: TEventTypes;
  data: any;
}

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'foodMapChat',
})
export class FoodMapChatGateway {
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

  @SubscribeMessage(EventTriggerTypes.CREATEROOM)
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { event, data }: callBody,
  ): Promise<void> {
    // 굳이 서비스에서 또 찾아야하나?
    // 룸 정보를 데이터로 보내면 될듯
    if (typeof data === 'object' && data.hasOwnProperty('uuid')) {
      const room = await this.roomService.RoomInfo(data.uuid);

      client.broadcast.emit(EventTriggerTypes.CREATEROOM, {
        event,
        data: room.roomInfo,
      } as responeData);
    }
  }
}
