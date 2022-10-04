import { PickType } from '@nestjs/swagger';
import { ShopSoldItem } from 'src/shop-item/eitities/shop-soldItem.entity';

export class CreateSolidItemInPutDto extends PickType(ShopSoldItem, [
  'sellUserInfo',
  'payment',
  'shipInfo',
  'soldItemsInfo',
  'Ireceipt',
]) {}
