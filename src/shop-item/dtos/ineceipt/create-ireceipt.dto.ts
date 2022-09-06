import { PickType, IntersectionType, ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopSoldItem } from 'src/shop-item/eitities/shop-soldItem.entity';
import { ShopIreceipt } from '../../eitities/shop-ireceipt.entity';

class soldItemsInfo extends PickType(ShopSoldItem, [
  'payment',
  'soldItemsInfo',
  'shipInfo',
] as const) {}

export class CreateIreceiptInputDto extends PickType(ShopIreceipt, [
  'paymentInfo',
  'totalPrice',
] as const) {
  @ApiProperty({
    type: () => [soldItemsInfo],
    description: '구매한 아이템 정보',
    example: '구매한 아이템 정보',
  })
  soldItems: soldItemsInfo[];
}

export class CreateIreceiptOutPutDto extends CoreOutPut {}
