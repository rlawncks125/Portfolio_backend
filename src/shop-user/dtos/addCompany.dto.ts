import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopUserSeller } from '../entities/shop-user-seller.entity';

export class AddCompanyInputDto extends OmitType(ShopUserSeller, [
  'user',
  'id',
  'Ireceipt',
  'sellItems',
] as const) {}

export class AddCompanyOutPutDto extends CoreOutPut {
  @ApiProperty({ description: '판매자정보', example: '판매자정보' })
  sellerInfo?: ShopUserSeller;
}
