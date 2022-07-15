import { PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopUser } from '../entities/shop-user.entity';

export class UpdateShopUserInput extends PickType(ShopUser, [
  'nickName',
  'password',
]) {}

export class UpdateShopUserOutPut extends CoreOutPut {}
