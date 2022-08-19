import {
  OmitType,
  PickType,
  IntersectionType,
  PartialType,
  ApiProperty,
} from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopItem } from '../eitities/shop-item.entity';

export class UpdateItemInputDto extends PartialType(
  OmitType(ShopItem, ['id', 'createAt', 'updateAt'] as const),
) {}

export class UpdateItemOutPut extends CoreOutPut {
  @ApiProperty({
    type: () => ShopItem,
    description: '아이템',
    example: '아이템',
  })
  item?: ShopItem;
}
