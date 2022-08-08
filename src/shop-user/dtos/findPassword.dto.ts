import { PickType } from '@nestjs/swagger';
import { ShopUser } from '../entities/shop-user.entity';

export class FindPasswordInputDto extends PickType(ShopUser, ['email']) {}
