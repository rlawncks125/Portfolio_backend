import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { ShopUser } from 'src/shop-user/entities/shop-user.entity';
import { Repository } from 'typeorm';

import { ShopIreceipt } from './eitities/shop-ireceipt.entity';
import {
  CreateIreceiptInputDto,
  CreateIreceiptOutPutDto,
} from './dtos/ineceipt/create-ireceipt.dto';
import { CreateSolidItemInPutDto } from './dtos/ineceipt/create-solditem.dto';
import { ShopSoldItem } from './eitities/shop-soldItem.entity';
import { GetIreceiptOutPutDto } from './dtos/ineceipt/get-ireceipt.dto';
import { GetSoldItemsOutPutDto } from './dtos/ineceipt/get-solditems.dto';
import {
  PatchSoldItemInputDto,
  PatchSoldItemOutputDto,
} from './dtos/patch-solditem.dto';

@Injectable()
export class ShopIreceiptService {
  constructor(
    @InjectRepository(ShopIreceipt)
    private readonly ireceipRepository: Repository<ShopIreceipt>,
    @InjectRepository(ShopSoldItem)
    private readonly soldItemRepository: Repository<ShopSoldItem>,
    private readonly appService: AppService,
  ) {}

  async CreateSoldItem(
    purchasedUser: ShopUser,
    { sellUserInfo, soldItemsInfo, payment, shipInfo }: CreateSolidItemInPutDto,
  ) {
    return await this.soldItemRepository.save(
      this.soldItemRepository.create({
        payment,
        purchasedUser,
        sellUserInfo,
        shipInfo,
        soldItemsInfo,
      }),
    );
  }

  async createIreceipt(
    user: ShopUser,
    { paymentInfo, soldItems: p_soldItems, totalPrice }: CreateIreceiptInputDto,
  ): Promise<CreateIreceiptOutPutDto> {
    let soldItems: ShopSoldItem[] | [] = [];

    let itemsList = [];
    p_soldItems.forEach(({ payment, shipInfo, soldItemsInfo }) => {
      itemsList.push(
        this.CreateSoldItem(user, {
          payment,
          sellUserInfo: soldItemsInfo.item.sellUserInfo,
          shipInfo,
          soldItemsInfo,
        }),
      );
    });

    await Promise.all(itemsList).then((v) => {
      soldItems = v as ShopSoldItem[];
    });

    await this.ireceipRepository.save(
      this.ireceipRepository.create({
        paymentInfo,
        soldItems,
        totalPrice,
        purchasedUser: user,
      }),
    );

    return {
      ok: false,
    };
  }

  async getIreceipts(user: ShopUser): Promise<GetIreceiptOutPutDto> {
    const ids = user.ireceipt.map((v) => v.id);
    const ireceipts = await this.ireceipRepository.findByIds(ids, {
      relations: ['soldItems', 'soldItems.sellUserInfo'],
    });

    return {
      ok: true,
      ireceipts,
    };
  }

  async getSoldItem(user: ShopUser): Promise<GetSoldItemsOutPutDto> {
    const items = await this.soldItemRepository.find({
      where: {
        sellUserInfo: user.sellerInfo,
      },
      relations: ['purchasedUser'],
    });

    return {
      ok: true,
      items,
    };
  }

  async updateSolidItem(
    user: ShopUser,
    { itemId, status, transportNumber }: PatchSoldItemInputDto,
  ): Promise<PatchSoldItemOutputDto> {
    try {
      const soldItem = await this.soldItemRepository.findOne(itemId, {
        relations: ['sellUserInfo'],
      });

      if (soldItem.sellUserInfo.id !== user.sellerInfo.id)
        return {
          ok: false,
          err: '소유자가 아닙니다.',
        };

      soldItem.status = status;

      transportNumber && (soldItem.transportNumber = transportNumber);

      const ok = await this.soldItemRepository.save(soldItem);

      if (!ok) {
        return {
          ok: false,
          err: '저장하지 못함',
        };
      }
      return {
        ok: true,
        soldItem,
      };
    } catch (err) {
      return {
        ok: false,
        err,
      };
    }
  }
}
