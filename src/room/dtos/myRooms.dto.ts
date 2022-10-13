import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import { Room } from '../entities/room.entity';

export class MyRoomsRestaurantInfoDto extends PickType(Restaurant, [
  'restaurantName',
  'restaurantImageUrl',
  'id',
  'resturantSuperUser',
  'lating',
  'location',
] as const) {}

export class MyRoomsJoinUserInfoDto extends PickType(User, [
  'id',
  'username',
] as const) {}

export class ApprovalWaitUsersInfoDto extends PickType(User, [
  'id',
  'username',
] as const) {}

class MyRoomsinfoDto extends PickType(Room, [
  'id',
  'uuid',
  'roomName',
  'lating',
  'superUser',
] as const) {
  @ApiProperty({
    description: '레스토랑 정보',
    type: () => [MyRoomsRestaurantInfoDto],
  })
  restaurantInfo: MyRoomsRestaurantInfoDto[];

  @ApiProperty({
    description: '방 내의 유저 정보들',
    type: () => [MyRoomsJoinUserInfoDto],
  })
  joinUsersInfo: MyRoomsJoinUserInfoDto[];

  @ApiProperty({
    description: '승인 대기중인 유저들',
    type: () => [ApprovalWaitUsersInfoDto],
  })
  approvalWaitUsers: ApprovalWaitUsersInfoDto[];
}

export class MyRoomsOutPutDto extends CoreOutPut {
  @ApiProperty({
    description: '방 정보들',
    type: () => [MyRoomsinfoDto],
  })
  myRooms?: MyRoomsinfoDto[];
}
