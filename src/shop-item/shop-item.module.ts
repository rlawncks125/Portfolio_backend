import { Module } from '@nestjs/common';
import { ShopItemService } from './shop-item.service';
import { ShopItemController } from './shop-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopItem } from './eitities/shop-item.entity';
import { ShopIreceipt } from './eitities/shop-ireceipt.entity';
import { AppService } from 'src/app.service';
import { ShopIreceiptService } from './shop-Ireceipt.service';
import { ShopSoldItem } from './eitities/shop-soldItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopItem, ShopIreceipt, ShopSoldItem])],
  providers: [ShopItemService, AppService, ShopIreceiptService],
  controllers: [ShopItemController],
})
export class ShopItemModule {}