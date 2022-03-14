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
import { emit } from 'process';
import { Server, Socket } from 'socket.io';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { RoomService } from 'src/room/room.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { wsUserId } from './ws.decorator';

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

  userMeataData: Array<{ client: Socket; user: User }> = [];

  handleConnection(client: Socket) {
    console.log('foodchat 연결', client.id);
  }

  handleDisconnect(client: Socket) {
    this.userMeataData = this.userMeataData.filter(
      (v) => v.client.id !== client.id,
    );
    this.leavRoomAll(client);
    console.log(`foodchat 연결 해제  : ${client.id}`);
  }

  leavRoomAll(client: Socket) {
    console.log(client.rooms);
    client.rooms.forEach((room) => {
      client.leave(room);
    });

    this.serverRoomCheck();
  }

  serverRoomCheck = () => {
    // @ts-ignore
    console.log('방 체크', this.server.adapter.rooms);
  };

  @SubscribeMessage('registration')
  async registration(
    @ConnectedSocket() client: Socket,
    @wsUserId() userid: number,
  ) {
    const user: User = await this.userService.findById(userid);

    this.userMeataData.push({
      client,
      user,
    });
    // console.log(this.userMeataData);
  }

  @SubscribeMessage('joinRoom')
  async joinRooms(
    @ConnectedSocket() client: Socket,
    @wsUserId() userid: number,
    @MessageBody() uuid: string,
  ) {
    console.log(`방 입장 : ${uuid}`);

    client.join(uuid);

    this.serverRoomCheck();
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() uuid: string,
  ) {
    console.log('방 나가기', uuid);

    client.leave(uuid);

    this.serverRoomCheck();
  }

  @SubscribeMessage('updateRoom')
  async updateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() uuid: string,
  ) {
    console.log('업데이트 룸', uuid);

    // 방에 모든유저 emit
    // this.server.to(uuid).emit('updateRoom', 'test');
    // 자신을 제외한 유저 emit
    client.broadcast.to(uuid).emit('updateRoom', uuid);
  }

  @SubscribeMessage('delteRoom')
  async delteRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() uuid: string,
  ) {
    console.log('룸 삭제', uuid);

    client.broadcast.to(uuid).emit('delteRoom');
  }

  @SubscribeMessage('updateRestaurant')
  async updateRestaurant(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { uuid, restaurantId }: { uuid: string; restaurantId: number },
  ) {
    console.log('업데이트 레스토랑', uuid, '/', restaurantId);
    client.broadcast.to(uuid).emit('updateRestaurant', {
      uuid,
      restaurantId,
    });
  }

  @SubscribeMessage('ApprovaWait')
  async ApprovaWait(@MessageBody() userId: number) {
    console.log('승인 :', userId);

    const userMeta = this.userMeataData.filter((v) => v.user.id === userId);

    userMeta.forEach((v) => {
      v.client.emit('updateApprovaWait');
    });
  }

  @SubscribeMessage('reqApprovaWait')
  async reqApprovaWait(@MessageBody() uuid: string) {
    const room = await this.roomService.RoomInfo(uuid);
    const superUser = this.userMeataData.find(
      (v) => v.user.id === room.roomInfo.superUserInfo.id,
    );
    if (superUser) {
      superUser.client.emit('updateReqApprovaWait');
    }
  }

  @SubscribeMessage('createMaker')
  async createMaker(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { uuid, restaurantId }: { uuid: string; restaurantId: string },
  ) {
    console.log('업데이트 마커', uuid, restaurantId);

    client.broadcast.to(uuid).emit('createMaker', restaurantId);
  }

  @SubscribeMessage('removeMaker')
  async removeMaker(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { uuid, restaurantId }: { uuid: string; restaurantId: string },
  ) {
    console.log('removeMaker', uuid, restaurantId);

    client.broadcast.to(uuid).emit('removeMaker', restaurantId);
  }
}
