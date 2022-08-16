import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopItem } from '../eitities/shop-item.entity';

export class AddShopItemInputDto extends PickType(ShopItem, [
  'title',
  'price',
  'sale',
  'thumbnailSrc',
  'detailHtml',
  'options',
  'parcel',
  'freeParcel',
  'origin',
  'reviews',
  'QA',
] as const) {}

export class AddShopItemsOutPutDto extends CoreOutPut {
  @ApiProperty({
    description: '아이템',
    example: '아이템',
  })
  item?: ShopItem;
}
