import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { BaksetItemSelectedOptions } from 'src/common/entities/bask-item';
import { ShopItem } from '../eitities/shop-item.entity';

class BasketItemInfo {
  @ApiProperty({ description: '아이템 id ', example: '아이템 id' })
  item: ShopItem;

  @ApiProperty({
    type: () => [BaksetItemSelectedOptions],
    description: '옵션 구매 갯수 ',
    example: '옵션 구매 갯수',
  })
  selectedOptions: BaksetItemSelectedOptions[];
}

export class GetBasketItemsOutPutDto extends CoreOutPut {
  @ApiProperty({
    type: () => [BasketItemInfo],
    description: '장바구니 아이템들 정보',
    example: '장바구니 아이템들 정보',
  })
  items?: BasketItemInfo[];
}
