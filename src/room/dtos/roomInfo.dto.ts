import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import { Room } from '../entities/room.entity';

export class RoomInfoInput extends PickType(Room, ['uuid']) {}

class RoomUsers extends PickType(User, ['id', 'username']) {}
class RestaurantInfo extends OmitType(Restaurant, [
  'createAt',
  'updateAt',
  'parentRoom',
  'avgStarUpdate',
]) {}

export class RoomInfoOutPut extends CoreOutPut {
  @ApiProperty({
    description: '방안에 유저들',
    type: () => [RoomUsers],
  })
  users?: RoomUsers[];

  @ApiProperty({
    description: '레스토랑 정보들',
    type: () => [RestaurantInfo],
  })
  RestaurantInfo?: RestaurantInfo[];
}
