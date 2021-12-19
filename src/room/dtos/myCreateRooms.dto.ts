import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

class MyRoomsinfoDto extends PickType(Room, [
  'id',
  'roomName',
  'uuid',
  'lating',
]) {}

export class MyCreateRoomsOutPutDto extends CoreOutPut {
  @ApiProperty({
    description: '룸정보',
    type: () => [MyRoomsinfoDto],
  })
  myRooms?: MyRoomsinfoDto[];
}
