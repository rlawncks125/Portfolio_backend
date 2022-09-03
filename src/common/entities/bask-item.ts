import { ApiProperty } from '@nestjs/swagger';

// JSON 형식으로 만듬

export class BaksetItemSelectedOptions {
  @ApiProperty({ description: '옵션 이름', example: '옵션 이름' })
  name: string;
  @ApiProperty({ description: '옵션 가격', example: '옵션 가격' })
  price: number;
  @ApiProperty({ description: '옵션 선택 개수', example: '옵션 선택 개수' })
  count: number;
}

export class BasketItem {
  @ApiProperty({ description: '아이템 id ', example: '아이템 id' })
  itemId: number;

  @ApiProperty({
    type: () => [BaksetItemSelectedOptions],
    description: '옵션 구매 갯수 ',
    example: '옵션 구매 갯수',
  })
  selectedOptions: BaksetItemSelectedOptions[];
}
