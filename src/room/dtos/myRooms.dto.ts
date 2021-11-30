import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

class MyRooms extends PickType(Room, ['id', 'uuid', 'roomName', 'lating']) {}

export class MyRoomsOutPut extends CoreOutPut {
  @ApiProperty({
    description: '방 정보들',
    type: () => [MyRooms],
  })
  myRooms?: MyRooms[];
}
