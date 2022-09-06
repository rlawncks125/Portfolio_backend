import {
  ApiProperty,
  PickType,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopUser } from '../entities/shop-user.entity';

class SellerRealtions extends PartialType(
  PickType(ShopUser, ['sellerInfo'] as const),
) {}

export class UserInfo extends PickType(ShopUser, [
  'email',
  'nickName',
  'tel',
  'addressDetail',
  'address',
  'postcode',
  'role',
]) {}

export class LoginShopUserOutPut extends IntersectionType(
  CoreOutPut,
  SellerRealtions,
) {
  @ApiProperty({ description: '토큰', example: '토큰' })
  token?: string;

  @ApiProperty({ description: '유저', example: '유저' })
  userInfo?: UserInfo;
}
