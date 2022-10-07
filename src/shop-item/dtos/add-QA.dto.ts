import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { QA } from '../eitities/shop-item.entity';

export class AddQAInputDto extends PickType(QA, ['text', 'type', 'title']) {
  @ApiProperty({ description: '아이템 아이디', example: '아이템 아이디' })
  itemId: number;
}

export class AddQAOutPutDto extends CoreOutPut {}
