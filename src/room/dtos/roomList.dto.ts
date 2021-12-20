import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { User } from 'src/user/entities/user.entity';
import { Room } from '../entities/room.entity';

class superUserInfoDto extends PickType(User, ['username']) {}
class roomInfoDto extends PickType(Room, ['uuid', 'roomName']) {
  @ApiProperty({
    description: '방장 유저 정보',
    type: () => superUserInfoDto,
  })
  superUserinfo?: superUserInfoDto;
}

export class roomListOutPutDto extends CoreOutPut {
  @ApiProperty({
    description: '방장 정보들',
    type: () => [roomInfoDto],
  })
  roomList?: roomInfoDto[];
}
