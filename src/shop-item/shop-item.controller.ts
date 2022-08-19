import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShopAuthGuard } from 'src/auth/auth.guard';
import { authUser } from 'src/auth/authUser.decorator';
import { ShopRoles } from 'src/auth/roles.decorator';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { ShopUser } from 'src/shop-user/entities/shop-user.entity';
import {
  AddShopItemInputDto,
  AddShopItemsOutPutDto,
} from './dtos/addShopItem.dto';
import { GetItemInfoOutPutDto } from './dtos/get-iteminfo.dto';
import { SellitemsOutPutDto } from './dtos/sell-items.dto';
import { UpdateItemInputDto, UpdateItemOutPut } from './dtos/update-item.dto';
import { ShopItemService } from './shop-item.service';

@ApiTags('shopitem')
@Controller('shop-item')
export class ShopItemController {
  constructor(private readonly itemService: ShopItemService) {}

  @ApiOperation({ summary: '아이템 추가' })
  @ApiResponse({
    type: AddShopItemsOutPutDto,
    status: 200,
  })
  @Post()
  @UseGuards(ShopAuthGuard)
  @ShopRoles(['company'])
  async addItem(
    @authUser() user: ShopUser,
    @Body() body: AddShopItemInputDto,
  ): Promise<AddShopItemsOutPutDto> {
    return this.itemService.addItem(user, body);
  }

  // 아이템 변경
  @ApiOperation({ summary: '아이템 변경' })
  @ApiResponse({
    type: UpdateItemOutPut,
    status: 200,
  })
  @Patch(':id')
  @UseGuards(ShopAuthGuard)
  @ShopRoles(['company'])
  async updateItem(
    @authUser() user: ShopUser,
    @Param() parm: { id: string },
    @Body() body: UpdateItemInputDto,
  ) {
    return this.itemService.updateItem(user, +parm.id, body);
  }

  // 아이템 삭제

  //

  @ApiOperation({ summary: '등록한 아이템들 얻기' })
  @ApiResponse({
    type: SellitemsOutPutDto,
    status: 200,
  })
  @Get('sell-items')
  @UseGuards(ShopAuthGuard)
  @ShopRoles(['company'])
  async getSellItems(@authUser() user: ShopUser) {
    return this.itemService.getSellItems(user);
  }

  @ApiOperation({ summary: '아이템들 정보 얻기' })
  @ApiResponse({
    type: GetItemInfoOutPutDto,
    status: 200,
  })
  @Get(':id')
  async getItemById(@Param() param) {
    return this.itemService.getItemById(+param.id);
  }

  @ApiOperation({ summary: '아이템 삭제' })
  @ApiResponse({
    type: CoreOutPut,
    status: 200,
  })
  @Delete(':id')
  @UseGuards(ShopAuthGuard)
  @ShopRoles(['company'])
  async deleteItem(@authUser() user, @Param() param) {
    return this.itemService.deleteItemById(user, +param.id);
  }

  // 결제 ( 영수증 생성 )

  //
}
