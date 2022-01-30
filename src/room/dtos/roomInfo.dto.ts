import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import { Room } from '../entities/room.entity';

export class RoomInfoInputDto extends PickType(Room, ['uuid']) {}

class RoomUsersDto extends PickType(User, ['id', 'username']) {}
class RestaurantInfoDto extends OmitType(Restaurant, [
  'createAt',
  'updateAt',
  'parentRoom',
  'avgStarUpdate',
  'removeCommentUpdateAvgStarById',
] as const) {}
class RoominfoDto extends PickType(Room, ['roomName', 'lating' as const]) {
  @ApiProperty({
    description: '방장 정보',
    type: () => RoomUsersDto,
  })
  superUserInfo: RoomUsersDto;
}

export class RoomInfoOutPutDto extends CoreOutPut {
  @ApiProperty({
    description: '방 정보',
    type: () => RoominfoDto,
  })
  roomInfo?: RoominfoDto;

  @ApiProperty({
    description: '방안에 유저들',
    type: () => [RoomUsersDto],
  })
  users?: RoomUsersDto[];

  @ApiProperty({
    description: '레스토랑 정보들',
    type: () => [RestaurantInfoDto],
  })
  RestaurantInfo?: RestaurantInfoDto[];
}
