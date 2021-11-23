import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoomDtoInput, CreateRoomDtoOutPut } from './dtos/CreateRoom.dto';

@ApiTags('WebScoket/chat')
@Controller('WebScoket/chat')
export class WsController {
  @ApiOperation({ summary: 'CreateRoom' })
  @ApiResponse({
    type: CreateRoomDtoOutPut,
    status: 200,
  })
  @Post('CreateRoom')
  CreateRoomBody(@Body() data: CreateRoomDtoInput) {}
}
