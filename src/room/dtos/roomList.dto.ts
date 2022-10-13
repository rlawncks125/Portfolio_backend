import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { User } from 'src/user/entities/user.entity';
import { Room } from '../entities/room.entity';

export enum searchTypeEnum {
  All = 'All',
  RoomName = 'RoomName',
  SuperUser = 'SuperUser',
}

class superUserInfoDto extends PickType(User, ['username']) {}
class roomInfoDto extends PickType(Room, ['uuid', 'roomName', 'id']) {
  @ApiProperty({
    description: '방장 유저 정보',
    type: () => superUserInfoDto,
  })
  superUserinfo?: superUserInfoDto;
}

export class RoomListInputDto {
  @ApiProperty({
    description: '서치 유형',
    enum: searchTypeEnum,
  })
  searchType: searchTypeEnum;

  @ApiProperty({
    description: '값',
    type: () => String,
    required: false,
  })
  value?: string;
}

export class RoomListOutPutDto extends CoreOutPut {
  @ApiProperty({
    description: '방장 정보들',
    type: () => [roomInfoDto],
  })
  roomList?: roomInfoDto[];
}
