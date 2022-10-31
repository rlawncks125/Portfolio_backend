import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/restaurant.entity';
import { RestaurantInfoDto } from './common/RestaurantInfo.dto';

export class GetRestaurantByIdOutPutDto extends CoreOutPut {
  @ApiProperty({ type: () => RestaurantInfoDto })
  restaurant?: RestaurantInfoDto;
}

export class GetRestaurantByIdParmsDto extends PickType(Restaurant, ['id']) {}
