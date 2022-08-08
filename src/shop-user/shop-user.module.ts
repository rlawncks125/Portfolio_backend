import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerService } from 'src/mailer/mailer.service';
import { ShopUserSeller } from './entities/shop-user-seller.entity';
import { ShopUser } from './entities/shop-user.entity';
import { ShopUserController } from './shop-user.controller';
import { ShopUserService } from './shop-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShopUser, ShopUserSeller])],
  controllers: [ShopUserController],
  providers: [ShopUserService, MailerService],
  exports: [ShopUserService],
})
export class ShopUserModule {}
