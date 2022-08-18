import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { ShopUser } from 'src/shop-user/entities/shop-user.entity';
import { Repository } from 'typeorm';
import {
  AddShopItemInputDto,
  AddShopItemsOutPutDto,
} from './dtos/addShopItem.dto';
import { ShopIreceipt } from './eitities/shop-ireceipt.entity';
import { ShopItem } from './eitities/shop-item.entity';

@Injectable()
export class ShopItemService {
  constructor(
    @InjectRepository(ShopItem)
    private readonly itemRepository: Repository<ShopItem>,
    @InjectRepository(ShopIreceipt)
    private readonly ireceipRepository: Repository<ShopIreceipt>,
    private readonly appService: AppService,
  ) {}

  async getSellItems(user: ShopUser) {
    if (!user?.sellerInfo) {
      return {
        ok: false,
        err: '잘못된접근',
      };
    }

    const items = await this.itemRepository.find({
      sellUserInfo: user.sellerInfo,
    });

    return {
      ok: true,
      items,
    };
  }

  async addItem(
    user: ShopUser,
    body: AddShopItemInputDto,
  ): Promise<AddShopItemsOutPutDto> {
    if (!user.sellerInfo) {
      return {
        ok: false,
        err: '판매자 등록을 해주세요.',
      };
    }

    const data: ShopItem = {
      ...body,
      sellUserInfo: user.sellerInfo,
      QA: [],
      reviews: [],
    };

    const item = await this.itemRepository.save(
      this.itemRepository.create(data),
    );

    if (!item) {
      return {
        ok: false,
        err: '생성도중 에러가 발생했습니다.',
      };
    }

    return {
      ok: true,
      item,
    };
  }

  async deleteItemById(id: number) {
    const shopItem = await this.itemRepository.findOne({ id });
    await this.appService.deleteShopItemImageByHtml(shopItem.detailHtml);

    const result = await this.itemRepository.remove(shopItem);

    if (!result) {
      return {
        ok: false,
      };
    }

    return {
      ok: true,
    };
  }

  async getItemById(id: number) {
    const item = await this.itemRepository.findOne(
      { id },
      { relations: ['sellUserInfo'] },
    );

    return {
      ok: true,
      item,
    };
  }
}
