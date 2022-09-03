import { PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopIreceipt } from '../eitities/shop-ireceipt.entity';

export class CreateIreceiptInputDto extends PickType(ShopIreceipt, [
  'sellUserInfo',
  'purchasedUser',
  'Items',
  'paymentInfo',
]) {}

export class CreateIreceiptOutPutDto extends CoreOutPut {}
