import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopSoldItem } from 'src/shop-item/eitities/shop-soldItem.entity';

export class GetSoldItemsOutPutDto extends CoreOutPut {
  @ApiProperty({
    type: () => [ShopSoldItem],
    description: '판매한아이템',
    example: '판매한아이템',
  })
  items: ShopSoldItem[];
}
