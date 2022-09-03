import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopItem } from '../eitities/shop-item.entity';

export class GetItemsInfoInputDto {
  @ApiProperty({
    type: [Number],
    description: '가져올 아이템 id 들',
    example: '가져올 아이템 id 들',
  })
  ids: number[];
}

export class GetItemsInfoOutPutDto extends CoreOutPut {
  @ApiProperty({
    type: () => [ShopItem],
    description: '아이템들 정보',
    example: '아이템들 정보',
  })
  shopItems?: ShopItem[];
}
