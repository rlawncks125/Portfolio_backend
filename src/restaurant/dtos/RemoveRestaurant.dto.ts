import { PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/restaurant.entity';

export class RemoveRestaurantOutPutDto extends CoreOutPut {}

export class RemoveRestaurantPramsDto extends PickType(Restaurant, ['id']) {}
