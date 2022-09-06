import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ShopAuthGuard } from 'src/auth/auth.guard';
import { authUser } from 'src/auth/authUser.decorator';
import { BasicAuth } from 'src/auth/basicAuth.decorator';
import { ShopRoles } from 'src/auth/roles.decorator';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { basicAuth } from 'src/common/interface';
import {
  AddBasketItemInputDto,
  AddBasketItemOutPutDto,
} from './dtos/addBasketItem.dto';
import { AddCompanyInputDto, AddCompanyOutPutDto } from './dtos/addCompany.dto';
import {
  CreateShopUserInputDto,
  CreateShopUserOutPut,
} from './dtos/createShopUser.dto';
import { FindPasswordInputDto } from './dtos/findPassword.dto';
import { LoginShopUserOutPut } from './dtos/loginShopUser.dto';
import {
  RemoveBasketItemInputDto,
  RemoveBasketItemOutPutdto,
} from './dtos/removeBasketItem.dto';
import {
  UpdateCompanyInutDto,
  UpdateCompanyOutPutDto,
} from './dtos/updateCompany.dto';

import {
  UpdateShopUserInput,
  UpdateShopUserOutPut,
} from './dtos/updateShopUser.dto';
import { ShopUser } from './entities/shop-user.entity';
import { ShopUserService } from './shop-user.service';

@ApiTags('shopUser')
@Controller('shop-user')
export class ShopUserController {
  constructor(private readonly shopUserService: ShopUserService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    type: CreateShopUserOutPut,
    status: 200,
  })
  @ApiBasicAuth()
  @Post()
  userCreate(
    @BasicAuth() auth: basicAuth,
    @Body() input: CreateShopUserInputDto,
  ): Promise<CreateShopUserOutPut> {
    return this.shopUserService.create(auth, input);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    type: LoginShopUserOutPut,
    status: 200,
  })
  @ApiBasicAuth()
  @Get()
  userLogin(@BasicAuth() auth: basicAuth): Promise<LoginShopUserOutPut> {
    return this.shopUserService.login(auth);
  }

  @ApiOperation({ summary: '내정보 얻기' })
  @ApiResponse({
    type: LoginShopUserOutPut,
    status: 200,
  })
  @UseGuards(ShopAuthGuard)
  @Get('myinfo')
  myInfo(@authUser() user: ShopUser): LoginShopUserOutPut {
    return {
      ok: true,
      sellerInfo: user.sellerInfo,
      userInfo: {
        email: user.email,
        nickName: user.nickName,
        postcode: user.postcode,
        tel: user.tel,
        addressDetail: user.addressDetail,
        address: user.address,
        role: user.role,
      },
    };
  }

  @ApiOperation({ summary: '패스워드 확인' })
  @ApiResponse({
    type: CoreOutPut,
    status: 200,
  })
  @UseGuards(ShopAuthGuard)
  @ApiBasicAuth()
  @Get('passwordConfirm')
  passwordConfirm(
    @authUser() user: ShopUser,
    @BasicAuth() auth: basicAuth,
  ): Promise<CoreOutPut> {
    return this.shopUserService.passwordConfirm(user, auth);
  }

  @ApiOperation({ summary: '패스워드 찾기' })
  @ApiResponse({
    type: CoreOutPut,
    status: 200,
  })
  @Post('findPassword')
  findPassword(@Body() { email }: FindPasswordInputDto): Promise<CoreOutPut> {
    return this.shopUserService.findPassword(email);
  }

  @ApiOperation({ summary: '정보 변경 ( userUpdate )' })
  @ApiResponse({
    type: UpdateShopUserOutPut,
    status: 200,
  })
  @Patch()
  @UseGuards(ShopAuthGuard)
  @ShopRoles(['company', 'customer'])
  userUpdate(@authUser() user: ShopUser, @Body() body: UpdateShopUserInput) {
    return this.shopUserService.update(user, body);
  }

  @ApiOperation({ summary: '유저삭제' })
  @ApiResponse({
    type: CoreOutPut,
    status: 200,
  })
  @Delete()
  @UseGuards(ShopAuthGuard)
  userDlete(@authUser() user: ShopUser) {
    return this.shopUserService.delete(user);
  }

  @ApiOperation({ summary: '회사 정보 추가' })
  @ApiResponse({
    type: AddCompanyOutPutDto,
    status: 200,
  })
  @Post('company')
  @ShopRoles(['company'])
  @UseGuards(ShopAuthGuard)
  addCompany(@authUser() user: ShopUser, @Body() body: AddCompanyInputDto) {
    return this.shopUserService.addCompany(user, body);
  }

  @ApiOperation({ summary: '회사 정보 변경' })
  @ApiResponse({
    type: UpdateCompanyOutPutDto,
    status: 200,
  })
  @Patch('company')
  @ShopRoles(['company'])
  @UseGuards(ShopAuthGuard)
  updateCompany(
    @authUser() user: ShopUser,
    @Body() body: UpdateCompanyInutDto,
  ) {
    return this.shopUserService.updateCompany(user, body);
  }

  @ApiOperation({ summary: '회사 정보 삭제' })
  @ApiResponse({
    type: UpdateCompanyOutPutDto,
    status: 200,
  })
  @Delete('company')
  @ShopRoles(['company'])
  @UseGuards(ShopAuthGuard)
  deleteCompany(@authUser() user: ShopUser) {
    return this.shopUserService.deleteCompany(user);
  }

  @ApiOperation({ summary: '장바구니 추가' })
  @ApiResponse({
    type: AddBasketItemOutPutDto,
    status: 200,
  })
  @ShopRoles(['customer'])
  @UseGuards(ShopAuthGuard)
  @Post('baskItem')
  addBasketItem(
    @authUser() user: ShopUser,
    @Body() input: AddBasketItemInputDto,
  ) {
    return this.shopUserService.addBasketItem(user, input);
  }

  @ApiOperation({ summary: '장바구니 아이템 삭제' })
  @ApiResponse({
    type: RemoveBasketItemOutPutdto,
    status: 200,
  })
  @ShopRoles(['customer'])
  @UseGuards(ShopAuthGuard)
  @Patch('baskItem')
  removeBasketItem(
    @authUser() user: ShopUser,
    @Body() input: RemoveBasketItemInputDto,
  ) {
    return this.shopUserService.removeBasketItem(user, input);
  }
}
