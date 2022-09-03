import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { BasketItem } from 'src/common/entities/bask-item';

export class AddBasketItemInputDto {
  @ApiProperty({
    description: '추가할 장바구니 아이템',
    example: '추가할 장바구니 아이템',
  })
  basketItem: BasketItem;
}

export class AddBasketItemOutPutDto extends CoreOutPut {}
