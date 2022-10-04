import { Module } from '@nestjs/common';
import { ShopItemService } from './shop-item.service';
import { ShopItemController } from './shop-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopItem } from './eitities/shop-item.entity';
import { ShopIreceipt } from './eitities/shop-ireceipt.entity';
import { AppService } from 'src/app.service';
import { ShopIreceiptService } from './shop-Ireceipt.service';
import { ShopSoldItem } from './eitities/shop-soldItem.entity';

import { ShopUserService } from 'src/shop-user/shop-user.service';

import { ShopUserModule } from 'src/shop-user/shop-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopItem, ShopIreceipt, ShopSoldItem]),
    ShopUserModule,
  ],
  providers: [ShopItemService, AppService, ShopIreceiptService],
  controllers: [ShopItemController],
})
export class ShopItemModule {}
