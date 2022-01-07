import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EventTriggerTypes } from './foodMapChat.gateway';

class EventTrigger {
  @ApiProperty({
    enum: EventTriggerTypes,
  })
  Types: keyof typeof EventTriggerTypes;
}

@ApiTags('WebScoket/chat')
@Controller('WebScoket/chat')
export class WsController {
  @ApiOperation({ summary: '이벤트 타입' })
  @Get()
  foodMapChat(@Body() _: EventTrigger) {}
}
