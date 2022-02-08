import {
  Body,
  Controller,
  Delete,
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
import { CreateRoomInputDto, CreateRoomOutPutDto } from './dtos/createRoom.dto';
import { JoinRoomInputDto, JoinRoomOutPutDto } from './dtos/joinRooms.dto';
import { MyCreateRoomsOutPutDto } from './dtos/myCreateRooms.dto';
import { MyRoomsOutPutDto } from './dtos/myRooms.dto';
import { RoomListInputDto, RoomListOutPutDto } from './dtos/roomList.dto';
import { RoomInfoInputDto, RoomInfoOutPutDto } from './dtos/roomInfo.dto';
import { LeaveRoomInputDto, LeaveRoomOutPutDto } from './dtos/leaveRoom.dto';
import { RoomService } from './room.service';
import { RemoveRoomInPutDto, RemoveRoomOutPutDto } from './dtos/RemoveRoom.dto';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: '내가 들어간방들 정보 ( myRoomsInfo )' })
  @ApiResponse({
    type: MyRoomsOutPutDto,
    status: 200,
  })
  @Get()
  @UseGuards(AuthGuard)
  async myRoomsInfo(@authUser() user: User): Promise<MyRoomsOutPutDto> {
    return this.roomService.myRoomsInfo(user);
  }

  @Post('list')
  @ApiOperation({ summary: '방 목록 ( roomList )' })
  @ApiResponse({
    type: RoomListOutPutDto,
    status: 200,
  })
  async roomList(@Body() input: RoomListInputDto): Promise<RoomListOutPutDto> {
    return this.roomService.roomList(input);
  }

  @ApiOperation({ summary: '방 만들기 ( createRoom )' })
  @ApiResponse({
    type: CreateRoomOutPutDto,
    status: 200,
  })
  @Post()
  @UseGuards(AuthGuard)
  async createRoom(
    @authUser() user: User,
    @Body() body: CreateRoomInputDto,
  ): Promise<CreateRoomOutPutDto> {
    return this.roomService.createRoom(user, body);
  }

  @ApiOperation({ summary: '방 삭제하기 ( removeRoom )' })
  @Delete(':uuid')
  @UseGuards(AuthGuard)
  async removeRoom(
    @authUser() user: User,
    @Param() { uuid }: RemoveRoomInPutDto,
  ): Promise<RemoveRoomOutPutDto> {
    return this.roomService.removeRoom(user, uuid);
  }

  @ApiOperation({ summary: '내가 방장인 방들 조회 ( mySuperRooms )' })
  @ApiResponse({
    type: MyCreateRoomsOutPutDto,
    status: 200,
  })
  @Get('mySuperRooms')
  @UseGuards(AuthGuard)
  async mySuperRooms(@authUser() user: User): Promise<MyCreateRoomsOutPutDto> {
    return this.roomService.mySuperRooms(user);
  }

  @ApiOperation({ summary: '방 참여하기 ( joinRoom )' })
  @ApiResponse({
    type: JoinRoomOutPutDto,
    status: 200,
  })
  @Post('join')
  @UseGuards(AuthGuard)
  async joinRoom(
    @authUser() user: User,
    @Body() joinRoomInput: JoinRoomInputDto,
  ): Promise<JoinRoomOutPutDto> {
    return this.roomService.joinRoom(user, joinRoomInput);
  }

  @ApiOperation({ summary: '방 내의 정보들( roomInfo )' })
  @ApiResponse({
    type: RoomInfoOutPutDto,
    status: 200,
  })
  @Post('info')
  @UseGuards(AuthGuard)
  async roomInfo(
    @Body() { uuid }: RoomInfoInputDto,
  ): Promise<RoomInfoOutPutDto> {
    return this.roomService.RoomInfo(uuid);
  }

  @ApiOperation({ summary: '방나가기 ( leaveRoom )' })
  @ApiResponse({
    status: 200,
    type: LeaveRoomOutPutDto,
  })
  @Post('leave')
  @UseGuards(AuthGuard)
  async leaveRoom(
    @authUser() user: User,
    @Body() LeaveRoomInputDto: LeaveRoomInputDto,
  ): Promise<LeaveRoomOutPutDto> {
    return this.roomService.leaveRoom(user, LeaveRoomInputDto);
  }
}
