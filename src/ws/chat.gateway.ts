import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import {
  WSCreateRoomDtoInput,
  CreateRoomDtoOutPut,
} from './dtos/WSCreateRoom.dto';
import { wsUserId } from './ws.decorator';

enum ChatTypes {
  Join = 'Join',
  myChat = 'myChat',
  otherChat = 'otherChat',
  leaveRoom = 'leaveRoom',
}

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'chat',
})
export class ChatGateway {
  constructor(private readonly userService: UserService) {}
  @WebSocketServer()
  server: Server;

  roomList: Array<{ room: String; roomName: String }> = [];

  handleConnection(client: Socket) {
    console.log('연결', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log(`연결 해제  : ${client.id}`);
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @wsUserId() userId: Number,
    @ConnectedSocket() client: Socket,
    @MessageBody() data: WSCreateRoomDtoInput,
  ) {
    if (!userId) {
      client.emit('error', '존재하지 않는 유저입니다.');
      return;
    }

    const { room, position } = data;
    const user: User = await this.userService.findById(+userId);

    // 방만들기
    // 고유 아이디만들기
    // 방 테이블 만들어서 create 서비스 추가
    console.log(user.username, room, position);
    const uuid = Math.random() * 1000;
    const createRoom = `${room}:${uuid}`;
    const outPut: CreateRoomDtoOutPut = {
      ok: true,
      message: `${room}이 만들어졌습니다.`,
      room: createRoom,
    };
    client.emit('createRoom', outPut);

    this.roomList.push({ room: createRoom, roomName: room });

    client.join(createRoom);
    // client.leave(`${room}:${uuid}`); // 떠나기

    // 접속방 갱신
    this.updateMyRooms(client);
  }

  @SubscribeMessage('getRoomList')
  getRoomList(@ConnectedSocket() client: Socket) {
    client.emit('getRoomList', this.roomList);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @wsUserId() userId: Number,
    @ConnectedSocket() client: Socket,
    @MessageBody() data,
  ) {
    const { room } = data;
    const user: User = await this.userService.findById(+userId);
    client.join(room);
    console.log(`${user.username} 님이 ${room} 방에 입장하였습니다.`);
    this.server.to(room).emit('update', {
      type: ChatTypes.Join,
      message: `${user.username} 님이 입장하셨습니다.`,
      room,
    });

    // 접속방 갱신
    this.updateMyRooms(client);
  }

  @SubscribeMessage('messagePush')
  async messagePush(
    @wsUserId() userId: Number,
    @ConnectedSocket() client: Socket,
    @MessageBody() data,
  ) {
    const user: User = await this.userService.findById(+userId);
    const { stayRoom, message } = data;

    client.emit('update', {
      type: ChatTypes.myChat,
      message,
      room: stayRoom,
    });
    client.broadcast.to(stayRoom).emit('update', {
      type: ChatTypes.otherChat,
      message: `${user.username} : ${message}`,
      room: stayRoom,
    });
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @wsUserId() userId: Number,
    @ConnectedSocket() client: Socket,
    @MessageBody() data,
  ) {
    const user: User = await this.userService.findById(+userId);
    const { stayRoom } = data;

    client.broadcast.to(stayRoom).emit('update', {
      type: ChatTypes.leaveRoom,
      message: `${user.username} 님이 방을 나가셨습니다.`,
      room: stayRoom,
    });
    client.leave(stayRoom);
    // 접속방 갱신
    this.updateMyRooms(client);

    //   유저가 없는 방은 리스트에서 지우기
    const rooms = this.server.to(stayRoom)['adapter']['rooms'];
    if (!rooms.get(stayRoom)) {
      const newList = this.roomList.filter((v) => v.room !== stayRoom);
      this.roomList = newList;
      this.server.emit('getRoomList', this.roomList);
    }
  }

  //   접속 중인방 갱신
  updateMyRooms(client: Socket) {
    const myRoomsList = [];
    client.rooms.forEach((v) => {
      myRoomsList.push(v);
    });
    client.emit('myRooms', myRoomsList);
  }
}
