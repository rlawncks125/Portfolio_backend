import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopUser } from './entities/shop-user.entity';
import { ShopUserController } from './shop-user.controller';
import { ShopUserService } from './shop-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShopUser])],
  controllers: [ShopUserController],
  providers: [ShopUserService],
  exports: [ShopUserService],
})
export class ShopUserModule {}
