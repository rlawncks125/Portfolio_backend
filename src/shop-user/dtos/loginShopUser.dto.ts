import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopUserSeller } from '../entities/shop-user-seller.entity';
import { ShopUser } from '../entities/shop-user.entity';

class UserInfo extends PickType(ShopUser, [
  'email',
  'nickName',
  'tel',
  'addr',
  'postcode',
  'role',
]) {}

export class LoginShopUserOutPut extends CoreOutPut {
  @ApiProperty({ description: '토큰', example: '토큰' })
  token?: string;

  @ApiProperty({ description: '유저', example: '유저' })
  userInfo?: UserInfo;

  @ApiProperty({ description: '판매자정보', example: '판매자정보' })
  sellerInfo?: ShopUserSeller;
}
