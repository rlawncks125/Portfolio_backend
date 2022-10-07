import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { BaksetItemSelectedOptions } from 'src/common/entities/bask-item';
import { ShopUser } from 'src/shop-user/entities/shop-user.entity';
import { ShopUserService } from 'src/shop-user/shop-user.service';
import { ILike, Raw, Repository } from 'typeorm';
import { AddQAInputDto, AddQAOutPutDto } from './dtos/add-QA.dto';
import {
  AddShopItemInputDto,
  AddShopItemsOutPutDto,
} from './dtos/addShopItem.dto';
import { AnswerQAInputDto } from './dtos/answer-QA.dto';
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
import { QA, ShopItem } from './eitities/shop-item.entity';

@Injectable()
export class ShopItemService {
  constructor(
    @InjectRepository(ShopItem)
    private readonly itemRepository: Repository<ShopItem>,
    private readonly appService: AppService,
  ) {}

  async getSellItems(user: ShopUser): Promise<SellitemsOutPutDto> {
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
    console.log(user);

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

    const ok = await this.itemRepository.insert(
      this.itemRepository.create(data),
    );

    if (!ok) {
      return {
        ok: false,
        err: '생성도중 에러가 발생했습니다.',
      };
    }

    const item = await this.itemRepository.findOne(ok.identifiers[0].id);

    return {
      ok: true,
      item,
    };
  }

  async updateItem(
    user: ShopUser,
    id: number,
    input: UpdateItemInputDto,
  ): Promise<UpdateItemOutPut> {
    try {
      const shopItem = await this.itemRepository.findOne(
        { id },
        { relations: ['sellUserInfo'] },
      );

      if (shopItem.sellUserInfo.id !== user.sellerInfo.id) {
        return {
          ok: false,
          err: '소유자가 아닙니다.',
        };
      }

      if (input.detailHtml) {
        await this.appService.deleteShopItemImageByHtml(shopItem.detailHtml);
      }

      // update
      const ok = await this.itemRepository.update(id, {
        updateAt: new Date(),
        ...input,
      });

      if (!ok) {
        return {
          ok: false,
          err: '유효하지않은 접근 입니다.',
        };
      }

      return {
        ok: true,
      };
    } catch (err) {
      return {
        ok: false,
        err: '유효하지않은 접근 입니다.',
      };
    }
  }

  async deleteItemById(user: ShopUser, id: number): Promise<CoreOutPut> {
    const shopItem = await this.itemRepository.findOne(
      { id },
      { relations: ['sellUserInfo'] },
    );

    if (shopItem.sellUserInfo.id !== user.sellerInfo.id) {
      return {
        ok: false,
        err: '소유자가 아닙니다.',
      };
    }

    const deleteThumbnailURL = shopItem.thumbnailSrc
      .split('/')
      .pop()
      ?.split('.')[0];

    const deleteThumbnail =
      this.appService.deleteClouldnaryByFileName(deleteThumbnailURL);
    const deleteHtmlImages = this.appService.deleteShopItemImageByHtml(
      shopItem.detailHtml,
    );

    await Promise.all([deleteThumbnail, deleteHtmlImages]);

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

  async getItemById(id: number): Promise<GetItemInfoOutPutDto> {
    const item = await this.itemRepository.findOne(
      { id },
      { relations: ['sellUserInfo'] },
    );

    return {
      ok: true,
      item,
    };
  }

  async getItemByIds({
    ids,
  }: GetItemsInfoInputDto): Promise<GetItemsInfoOutPutDto> {
    try {
      const shopItems = await this.itemRepository.find({
        where: {
          id: Raw((id) => `${id} In (:...ids)`, {
            ids,
          }),
        },
        relations: ['sellUserInfo'],
      });

      return {
        ok: true,
        shopItems,
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }

  async searchItems({
    title,
    take,
    createTimeOrder,
  }: SearchItemsQueryInputDto): Promise<SearchItemsOutPutDto> {
    try {
      console.log('서치아이템', title, +take, createTimeOrder);
      const items = await this.itemRepository.find({
        where: {
          title: ILike(`%${title || ''}%`),
        },
        take: +take || 1,
        order: {
          createAt: createTimeOrder || 'DESC',
        },
      });

      return {
        ok: true,
        items,
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }

  async getBasketItems(user: ShopUser): Promise<GetBasketItemsOutPutDto> {
    console.log('장바구니호출');
    if (!user.basketItems) {
      return {
        ok: false,
        err: '등록된 아이템이 없습니다.',
      };
    }

    const optionsMap = new Map<number, BaksetItemSelectedOptions[]>();
    const shopItemsMap = new Map<number, ShopItem>();

    const ids = user.basketItems.map((v, index) => {
      optionsMap.set(index, v.selectedOptions);
      return v.itemId;
    });

    const { ok, shopItems } = await this.getItemByIds({
      ids,
    });

    if (!ok) {
      return {
        ok: false,
        err: '아이템들을 찾을수 없습니다.',
      };
    }

    shopItems.forEach((v) => {
      shopItemsMap.set(v.id, v);
    });

    return {
      ok: true,
      items: user.basketItems.map((v, index) => {
        return {
          item: shopItemsMap.get(v.itemId),
          selectedOptions: optionsMap.get(index) || [],
        };
      }),
    };
  }

  async addQA(
    user: ShopUser,
    { text, title, type, itemId }: AddQAInputDto,
  ): Promise<AddQAOutPutDto> {
    try {
      const item = await this.itemRepository.findOne({ id: itemId });

      if (!item) {
        return {
          ok: false,
          err: '아이템이 존재하지 않음',
        };
      }

      const QA: QA = {
        addDay: new Date().toLocaleString(),
        nickName: user.nickName,
        status: '답변 대기',
        text,
        title,
        type,
        answer: null,
      };

      const ok = await this.itemRepository.update(item.id, {
        QA: [...item.QA, QA],
        updateAt: new Date(),
      });

      if (!ok) {
        return {
          ok: false,
          err: '업데이트 하지 못함',
        };
      }

      return {
        ok: true,
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }

  async answerQA(user: ShopUser, { addDay, answer, itemId }: AnswerQAInputDto) {
    try {
      const item = await this.itemRepository.findOne(
        { id: itemId },
        {
          relations: ['sellUserInfo'],
        },
      );

      if (!item) {
        return {
          ok: false,
          err: '아이템이 존재하지 않음',
        };
      }

      if (item.sellUserInfo.id !== user.sellerInfo.id) {
        return {
          ok: false,
          err: '권한 없음',
        };
      }

      const QA = item.QA.map((v) => {
        if (v.addDay === addDay) {
          return {
            ...v,
            answer,
            status: '답변 완료',
          };
        }
        return v;
      });

      const ok = await this.itemRepository.update(item.id, {
        QA,
        updateAt: new Date(),
      });

      if (!ok) {
        return {
          ok: false,
          err: '업데이트 하지 못함',
        };
      }

      return {
        ok: true,
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }
}
