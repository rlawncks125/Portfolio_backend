import { Module } from '@nestjs/common';
import { ShopItemService } from './shop-item.service';
import { ShopItemController } from './shop-item.controller';

@Module({
  providers: [ShopItemService],
  controllers: [ShopItemController]
})
export class ShopItemModule {}
