import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { CoreEntity } from 'src/common/entities/core.entity';
import { ShopIreceipt } from 'src/shop-item/eitities/shop-ireceipt.entity';

export class GetIreceiptOutPutDto extends CoreOutPut {
  @ApiProperty({
    type: () => [ShopIreceipt],
    description: '주문 내역 정보',
    example: '주문 내역 정보',
  })
  ireceipts: ShopIreceipt[];
}
