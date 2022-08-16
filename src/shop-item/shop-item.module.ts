import { Module } from '@nestjs/common';
import { ShopItemService } from './shop-item.service';
import { ShopItemController } from './shop-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopItem } from './eitities/shop-item.entity';
import { ShopIreceipt } from './eitities/shop-ireceipt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopItem, ShopIreceipt])],
  providers: [ShopItemService],
  controllers: [ShopItemController],
})
export class ShopItemModule {}
