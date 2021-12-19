import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

class MyRoomsinfoDto extends PickType(Room, [
  'id',
  'uuid',
  'roomName',
  'lating',
]) {}

export class MyRoomsOutPutDto extends CoreOutPut {
  @ApiProperty({
    description: '방 정보들',
    type: () => [MyRoomsinfoDto],
  })
  myRooms?: MyRoomsinfoDto[];
}
