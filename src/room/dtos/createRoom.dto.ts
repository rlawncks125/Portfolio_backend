import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

export class CreateRoomInputDto extends PickType(Room, [
  'roomName',
  'lating',
]) {}

class RoomOutPutDto extends PickType(Room, [
  'id',
  'roomName',
  'uuid',
  'lating',
  'superUser',
]) {}

export class CreateRoomOutPutDto extends CoreOutPut {
  @ApiProperty({
    description: '방정보입니다.',
    required: false,
    type: RoomOutPutDto,
  })
  @IsOptional()
  room?: RoomOutPutDto;
}
