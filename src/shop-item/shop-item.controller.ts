import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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

  @Get('sell-items')
  @UseGuards(ShopAuthGuard)
  @ShopRoles(['company'])
  async getSellItems(@authUser() user: ShopUser) {
    return this.itemService.getSellItems(user);
  }
  @Get(':id')
  async getItemById(@Param() param) {
    return this.itemService.getItemById(+param.id);
  }
}
