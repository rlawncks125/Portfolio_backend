import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShopAuthGuard } from 'src/auth/auth.guard';
import { authUser } from 'src/auth/authUser.decorator';
import { BasicAuth } from 'src/auth/basicAuth.decorator';
import { ShopRoles } from 'src/auth/roles.decorator';
import { basicAuth } from 'src/common/interface';
import { CreateShopUserOutPut } from './dtos/createShopUser.dto';
import { LoginShopUserOutPut } from './dtos/loginShopUser.dto';
import { UpdateShopUserInput } from './dtos/updateShopUser.dto';
import { ShopUser } from './entities/shop-user.entity';
import { ShopUserService } from './shop-user.service';

@Controller('shop-user')
export class ShopUserController {
  constructor(private readonly shopUserService: ShopUserService) {}

  @ApiBasicAuth()
  @ApiOperation({ summary: '회원가입' })
  @Post()
  userCreate(@BasicAuth() auth: basicAuth): Promise<CreateShopUserOutPut> {
    return this.shopUserService.create(auth);
  }

  @ApiBasicAuth()
  @ApiOperation({ summary: '로그인' })
  @Get()
  userLogin(@BasicAuth() auth: basicAuth): Promise<LoginShopUserOutPut> {
    return this.shopUserService.login(auth);
  }

  @ApiOperation({ summary: '정보 변경 ( userUpdate )' })
  @Patch()
  @ShopRoles(['any'])
  @UseGuards(ShopAuthGuard)
  userUpdate(@authUser() user: ShopUser, @Body() body: UpdateShopUserInput) {
    return this.shopUserService.update(user, body);
  }

  @ApiOperation({ summary: '유저삭제' })
  @Delete()
  @UseGuards(ShopAuthGuard)
  userDlete(@authUser() user: ShopUser) {
    return this.shopUserService.delete(user);
  }
}
