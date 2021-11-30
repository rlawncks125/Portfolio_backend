import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { authUser } from 'src/auth/authUser.decorator';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateRoomInput, CreateRoomOutPut } from './dtos/createRoom.dto';
import { JoinRoomInput, JoinRoomOutPut } from './dtos/joinRooms.dto';
import { MyCreateRoomsOutPut } from './dtos/myCreateRooms.dto';
import { MyRoomsOutPut } from './dtos/myRooms.dto';
import { roomListOutPut } from './dtos/roomList.dto';
import { RoomInfoInput, RoomInfoOutPut } from './dtos/roomInfo.dto';
import { RoomService } from './room.service';
import { LeaveRoomInput, LeaveRoomOutPut } from './dtos/leaveRoom.dto';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: '내방 목록 ( myRooms )' })
  @ApiResponse({
    type: MyRoomsOutPut,
    status: 200,
  })
  @Get()
  @UseGuards(AuthGuard)
  async myRooms(@authUser() user: User): Promise<MyRoomsOutPut> {
    return this.roomService.myRooms(user);
  }

  @Get('list')
  @ApiOperation({ summary: '방 목록 ( myRooms )' })
  @ApiResponse({
    type: roomListOutPut,
    status: 200,
  })
  async roomList(): Promise<roomListOutPut> {
    return this.roomService.roomList();
  }

  @ApiOperation({ summary: '방 만들기 ( createRoom )' })
  @ApiResponse({
    type: CreateRoomOutPut,
    status: 200,
  })
  @Post()
  @UseGuards(AuthGuard)
  async createRoom(
    @authUser() user: User,
    @Body() body: CreateRoomInput,
  ): Promise<CreateRoomOutPut> {
    return this.roomService.createRoom(user, body);
  }

  @ApiOperation({ summary: '내가 만든 방들 조회 ( myCreateRooms )' })
  @ApiResponse({
    type: MyCreateRoomsOutPut,
    status: 200,
  })
  @Get('myCreateRooms')
  @UseGuards(AuthGuard)
  async myCreateRooms(@authUser() user: User): Promise<MyCreateRoomsOutPut> {
    return this.roomService.myCreateRooms(user);
  }

  @ApiOperation({ summary: '방 참여하기 ( joinRoom )' })
  @ApiResponse({
    type: JoinRoomOutPut,
    status: 200,
  })
  @Post('join')
  @UseGuards(AuthGuard)
  async joinRoom(
    @authUser() user: User,
    @Body() joinRoomInput: JoinRoomInput,
  ): Promise<JoinRoomOutPut> {
    return this.roomService.joinRoom(user, joinRoomInput);
  }

  @ApiOperation({ summary: '방 내의 정보들( roomInfo )' })
  @ApiResponse({
    type: RoomInfoOutPut,
    status: 200,
  })
  @Get('info')
  @UseGuards(AuthGuard)
  async roomInfo(@Body() { uuid }: RoomInfoInput): Promise<RoomInfoOutPut> {
    return this.roomService.RoomInfo(uuid);
  }

  @ApiOperation({ summary: '방나가기 ( leaveRoom )' })
  @ApiResponse({
    type: LeaveRoomOutPut,
    status: 200,
  })
  @Post('leave')
  @UseGuards(AuthGuard)
  async leaveRoom(
    @authUser() user: User,
    @Body() { uuid }: LeaveRoomInput,
  ): Promise<LeaveRoomOutPut> {
    return this.roomService.leaveRoom(user, uuid);
  }
}
