// const data = {
//     uuid: 'da8fc101-5189-45a9-ab89-be4a22797305',
//     name: '처음만든 레스토랑2',
//     location: '지역명2',
//     imageUrl: 'imageUrl2',
//     lating: {
//       x: 13.2,
//       y: 34.2,
//     },
//   };
//   // uuid로 room 찾기

import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Lating } from 'src/common/entities/Lating.entity';
import { Room } from 'src/room/entities/room.entity';
import { Column } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';

export class CreateRestaurantInputDto extends IntersectionType(
  PickType(Room, ['uuid'] as const),
  PickType(Restaurant, [
    'restaurantName',
    'location',
    'restaurantImageUrl',
    'lating',
    'hashTags',
    'specialization',
  ] as const),
) {}

export class CreateRestaurantOutPutDto extends CoreOutPut {
  @ApiProperty({
    description: '만들어진레스토랑 정보입니다.',
    required: false,
    type: Restaurant,
  })
  restaurant?: Restaurant;
}
