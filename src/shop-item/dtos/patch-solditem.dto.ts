import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopSoldItem } from '../eitities/shop-soldItem.entity';

export class PatchSoldItemInputDto {
  @ApiProperty({
    description: '변경할 아이템 아이디',
    example: '변경할 아이템 아이디',
  })
  itemId: number;

  @ApiProperty({
    description: '변경할 배송 상태',
    example: '변경할 배송 상태',
  })
  status: number;

  @ApiProperty({
    description: '운송장 번호',
    example: '운송장 번호',
    required: false,
  })
  transportNumber?: string;
}

export class PatchSoldItemOutputDto extends CoreOutPut {
  @ApiProperty({
    type: () => ShopSoldItem,
    description: '갱신된 판매 아이템',
    required: false,
  })
  soldItem?: ShopSoldItem;
}
