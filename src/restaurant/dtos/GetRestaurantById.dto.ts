import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/restaurant.entity';

class RestaurantInfoDto extends OmitType(Restaurant, ['parentRoom']) {}

export class GetRestaurantByIdOutPutDto extends CoreOutPut {
  @ApiProperty({ type: () => RestaurantInfoDto })
  restaurant?: RestaurantInfoDto;
}
