import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';

export class RemoveBasketItemInputDto {
  @ApiProperty({
    description: '장바구니 아이템 인덱스',
    example: '장바구니 아이템 인덱스',
  })
  itemIndex: number;
}

export class RemoveBasketItemOutPutdto extends CoreOutPut {
  @ApiProperty({
    description: '제거된 아이템 인덱스',
    example: '제거된 아이템 인덱스',
  })
  removeIndex?: number;
}
