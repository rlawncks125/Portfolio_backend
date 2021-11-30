import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { User } from 'src/user/entities/user.entity';
import { Room } from '../entities/room.entity';

class makerUserInfo extends PickType(User, ['username']) {}
class roomInfo extends PickType(Room, ['uuid', 'roomName']) {
  @ApiProperty({
    description: '방장 유저 정보',
    type: () => makerUserInfo,
  })
  makerUserinfo?: makerUserInfo;
}

export class roomListOutPut extends CoreOutPut {
  @ApiProperty({
    description: '방장 정보들',
    type: () => [roomInfo],
  })
  roomList?: roomInfo[];
}
