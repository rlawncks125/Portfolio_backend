import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopItem } from '../eitities/shop-item.entity';

export class GetSalseItemsOutPutDto extends CoreOutPut {
  @ApiProperty({
    type: () => [ShopItem],
    description: '아이템들 정보',
    example: '아이템들 정보',
  })
  items?: ShopItem[];
}
