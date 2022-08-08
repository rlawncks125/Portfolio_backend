import { PartialType, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopUserSeller } from '../entities/shop-user-seller.entity';

export class UpdateCompanyInutDto extends PartialType(
  PickType(ShopUserSeller, [
    'eMail',
    'represent',
    'phone',
    'companyName',
    'companyAddress',
  ] as const),
) {}

export class UpdateCompanyOutPutDto extends CoreOutPut {}
