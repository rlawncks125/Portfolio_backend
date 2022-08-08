import { OmitType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopUserSeller } from '../entities/shop-user-seller.entity';

export class AddCompanyInputDto extends OmitType(ShopUserSeller, [
  'user',
  'id',
] as const) {}

export class AddCompanyOutPutDto extends CoreOutPut {}
