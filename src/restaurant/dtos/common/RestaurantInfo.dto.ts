import { OmitType } from '@nestjs/swagger';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

export class RestaurantInfoDto extends OmitType(Restaurant, ['parentRoom']) {}
