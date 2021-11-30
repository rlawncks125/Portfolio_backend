import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

export class CreateRoomInput extends PickType(Room, ['roomName', 'lating']) {}

class RoomOutPut extends PickType(Room, [
  'id',
  'roomName',
  'uuid',
  'lating',
  'makerUser',
]) {}

export class CreateRoomOutPut extends CoreOutPut {
  @ApiProperty({
    description: '방정보입니다.',
    required: false,
    type: RoomOutPut,
  })
  @IsOptional()
  room?: RoomOutPut;
}
