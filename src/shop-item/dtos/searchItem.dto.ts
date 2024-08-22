import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Category, ShopItem } from '../eitities/shop-item.entity';

enum Order {
  'ASC' = 'ASC',
  'DESC' = 'DESC',
}

export class SearchItemsQueryInputDto extends PartialType(
  PickType(ShopItem, ['title'] as const),
) {
  @ApiProperty({
    description: '가져올 객수',
    example: '가져올 객수',
    required: false,
  })
  take?: number;

  @ApiProperty({
    description: 'ASC - 내림 , DESC - 오름',
    required: false,
    enum: [Order.ASC, Order.DESC],
  })
  createTimeOrder?: Order;

  @ApiProperty({
    description: '카테고리',
    example: 'Brand',
    required: false,
  })
  category?: Category;
}

export class SearchItemsOutPutDto extends CoreOutPut {
  @ApiProperty({
    description: '검색 아이템',
    example: '검색 아이템',
    type: () => [ShopItem],
  })
  items?: ShopItem[];
}
