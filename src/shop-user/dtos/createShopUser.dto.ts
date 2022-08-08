import { PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopUser } from '../entities/shop-user.entity';

export class CreateShopUserInputDto extends PickType(ShopUser, [
  'nickName',
  'role',
  'email',
  'addr',
  'tel',
  'postcode',
]) {}

export class CreateShopUserOutPut extends CoreOutPut {}
