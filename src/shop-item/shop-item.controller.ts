import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import {
  CreateIreceiptInputDto,
  CreateIreceiptOutPutDto,
} from './dtos/ineceipt/create-ireceipt.dto';
import { GetItemInfoOutPutDto } from './dtos/get-iteminfo.dto';
import {
  GetItemsInfoInputDto,
  GetItemsInfoOutPutDto,
} from './dtos/get-itemsInfo.dto';
import { GetBasketItemsOutPutDto } from './dtos/getBasketItems.dto';
import {
  SearchItemsOutPutDto,
  SearchItemsQueryInputDto,
} from './dtos/searchItem.dto';
import { SellitemsOutPutDto } from './dtos/sell-items.dto';
import { UpdateItemInputDto, UpdateItemOutPut } from './dtos/update-item.dto';
import { ShopIreceiptService } from './shop-Ireceipt.service';
import { ShopItemService } from './shop-item.service';
import { GetIreceiptOutPutDto } from './dtos/ineceipt/get-ireceipt.dto';
import { GetSoldItemsOutPutDto } from './dtos/ineceipt/get-solditems.dto';
import {
  PatchSoldItemInputDto,
  PatchSoldItemOutputDto,
} from './dtos/patch-solditem.dto';
import { AddReivewOutPutDto, AddReviewInputDto } from './dtos/add-review.dto';

@ApiTags('shopitem')
@Controller('shop-item')
export class ShopItemController {
  constructor(
    private readonly itemService: ShopItemService,
    private readonly ireceiptService: ShopIreceiptService,
  ) {}

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

  // 아이템 검색
  @ApiOperation({ summary: '아이템 검색' })
  @ApiResponse({
    type: SearchItemsOutPutDto,
    status: 200,
  })
  @Get('search')
  async searchItems(@Query() query: SearchItemsQueryInputDto) {
    return this.itemService.searchItems(query);
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

  @ApiOperation({ summary: '여러 아이템 정보 얻기' })
  @ApiResponse({
    type: GetItemsInfoOutPutDto,
    status: 200,
  })
  @UseGuards(ShopAuthGuard)
  @ShopRoles(['customer'])
  @Post('items')
  async getItemsByIds(@Body() body: GetItemsInfoInputDto) {
    return this.itemService.getItemByIds(body);
  }

  // 장바구니 아이템 얻기
  @ApiOperation({ summary: '장바구니 아이템 얻기' })
  @ApiResponse({
    type: GetBasketItemsOutPutDto,
    status: 200,
  })
  @UseGuards(ShopAuthGuard)
  @ShopRoles(['customer'])
  @Get('basket-items')
  async getBasketItems(@authUser() user: ShopUser) {
    return this.itemService.getBasketItems(user);
  }

  // 결제 ( 영수증 생성 )
  @ApiOperation({ summary: '영수증 발행' })
  @ApiResponse({
    type: CreateIreceiptOutPutDto,
    status: 200,
  })
  @UseGuards(ShopAuthGuard)
  @ShopRoles(['customer'])
  @Post('ireceipt')
  async createIreceipt(
    @authUser() user: ShopUser,
    @Body() body: CreateIreceiptInputDto,
  ) {
    return this.ireceiptService.createIreceipt(user, body);
  }

  // 주문내역
  @ApiOperation({ summary: '주문내역' })
  @ApiResponse({
    type: GetIreceiptOutPutDto,
    status: 200,
  })
  @UseGuards(ShopAuthGuard)
  @ShopRoles(['customer'])
  @Get('ireceipt')
  async getIreceipt(@authUser() user: ShopUser) {
    return this.ireceiptService.getIreceipts(user);
  }

  // 판매 한 아이템
  @ApiOperation({ summary: '판매한 아이템 목록' })
  @ApiResponse({
    type: GetSoldItemsOutPutDto,
    status: 200,
  })
  @UseGuards(ShopAuthGuard)
  @ShopRoles(['company'])
  @Get('soldItem')
  async getSoldItem(@authUser() user: ShopUser) {
    return this.ireceiptService.getSoldItem(user);
  }

  // 택배 화물 접수
  @ApiOperation({ summary: '판매아이템 정보 변경' })
  @ApiResponse({
    type: PatchSoldItemOutputDto,
    status: 200,
  })
  @UseGuards(ShopAuthGuard)
  @ShopRoles(['company'])
  @Patch('soldItem')
  async patchSolditem(
    @authUser() user: ShopUser,
    @Body() input: PatchSoldItemInputDto,
  ) {
    return this.ireceiptService.updateSolidItem(user, input);
  }

  @ApiOperation({ summary: '리뷰 달기' })
  @ApiResponse({
    type: AddReivewOutPutDto,
    status: 200,
  })
  @UseGuards(ShopAuthGuard)
  @ShopRoles(['customer'])
  @Post('soldItem')
  async addReview(
    @authUser() user: ShopUser,
    @Body() input: AddReviewInputDto,
  ) {
    return this.ireceiptService.addReivew(user, input);
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

  @ApiOperation({ summary: '아이템 정보 얻기' })
  @ApiResponse({
    type: GetItemInfoOutPutDto,
    status: 200,
  })
  @Get(':id')
  async getItemById(@Param() param) {
    console.log(`get ${param}`);
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
}
