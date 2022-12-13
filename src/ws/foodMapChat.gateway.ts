// 소켓 반응 할거 목록
// - 유저 방 참가 알림 ( 바로 반영 )
// - 댓글 추가 알림 ( 새로 고침 알림 )
// - 레스토랑 추가 알림 ( 새로 고침 알림 )

import { Interval, Timeout } from '@nestjs/schedule';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { emit } from 'process';
import { timeout } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { NotificationService } from 'src/notification/notification.service';
import {
  CommentService,
  RestaurantService,
} from 'src/restaurant/restaurant.service';
import { RoomService } from 'src/room/room.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { wsUserId } from './ws.decorator';

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'foodMapChat',
})
export class FoodMapChatGateway {
  @WebSocketServer()
  server: Server;

  userMeataData: Array<{ client: Socket; user: User }> = [];

  constructor(
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private readonly restaurantService: RestaurantService,
    private readonly commentService: CommentService,
  ) {}

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

    const room = await this.roomService.RoomInfo(uuid);

    // 방에 모든유저 emit
    // this.server.to(uuid).emit('updateRoom', 'test');
    // 자신을 제외한 유저 emit
    client.broadcast.to(uuid).emit('updateRoom', room);
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

    const { ok, restaurant } = await this.restaurantService.getRestaurantById(
      restaurantId,
    );

    ok &&
      client.broadcast.to(uuid).emit('updateRestaurant', {
        uuid,
        restaurant,
      });
  }

  @SubscribeMessage('ApprovaWait')
  async ApprovaWait(@MessageBody() userId: number) {
    // console.log('승인 :', userId);

    const userMeta = this.userMeataData.filter((v) => v.user.id === userId);

    userMeta.forEach((v) => {
      v.client.emit('updateApprovaWait');
    });
  }

  @SubscribeMessage('kickUser')
  async kickUser(@MessageBody() userId: number) {
    // console.log('강제퇴장 :', userId);

    const userMeta = this.userMeataData.filter((v) => v.user.id === userId);

    userMeta.forEach((v) => {
      v.client.emit('kickUser');
    });
  }

  @SubscribeMessage('reqApprovaWait')
  async reqApprovaWait(@MessageBody() uuid: string) {
    const room = await this.roomService.RoomInfo(uuid);
    const superUser = this.userMeataData.find(
      // (v) => v.user.id === room.roomInfo.superUserInfo.id,
      (v) => v.user.id === room.room.superUser.id,
    );
    if (superUser) {
      superUser.client.emit('updateReqApprovaWait');
    }
  }

  @SubscribeMessage('createRestaurant')
  async createRestaurant(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { uuid, restaurantId }: { uuid: string; restaurantId: string },
  ) {
    const { ok, restaurant } = await this.restaurantService.getRestaurantById(
      +restaurantId,
    );

    console.log('레스토랑 생성', uuid, restaurantId);

    ok && client.broadcast.to(uuid).emit('createRestaurant', restaurant);
  }

  @SubscribeMessage('removeRestaurant')
  async removeRestaurant(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { uuid, restaurantId }: { uuid: string; restaurantId: string },
  ) {
    console.log('레스토랑 삭제', uuid, restaurantId);

    client.broadcast.to(uuid).emit('removeRestaurant', restaurantId);
  }

  /** transport close 에러 문제
   * 이유 : 특정 소켓에 액티비티가 없는 경우 socket.io는
   * 자동으로 소켓을닫음
   * 해결 : 특정 시간마다 데이터(하트비트 연결됬다는 데이터 같음)를
   * 연결받아 타임 아웃 상태를 막음
   */
  @SubscribeMessage('pong')
  async heartbeatPingPong() {
    // console.log('pong');
  }

  @Interval(8000)
  sendHeartbeat() {
    if (this.server) {
      this.server?.emit('ping', { beat: 1 });
    }
    console.log('ping send');
  }
}
