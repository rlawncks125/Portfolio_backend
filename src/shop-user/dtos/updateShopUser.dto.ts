import { PartialType, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopUser } from '../entities/shop-user.entity';

export class UpdateShopUserInput extends PartialType(
  PickType(ShopUser, [
    'nickName',
    'password',
    'email',
    'address',
    'addressDetail',
    'tel',
    'postcode',
  ] as const),
) {}

export class UpdateShopUserOutPut extends CoreOutPut {}
