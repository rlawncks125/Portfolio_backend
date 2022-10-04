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

  async CreateSoldItemById(
    purchasedUser: ShopUser,
    {
      sellUserInfo,
      soldItemsInfo,
      payment,
      shipInfo,
      Ireceipt,
    }: CreateSolidItemInPutDto,
  ) {
    // return await this.soldItemRepository.save(
    const ok = await this.soldItemRepository.insert(
      this.soldItemRepository.create({
        payment,
        purchasedUser,
        sellUserInfo,
        shipInfo,
        soldItemsInfo,
        Ireceipt,
      }),
    );

    const id = ok.identifiers[0].id;

    return id;
  }

  async createIreceipt(
    user: ShopUser,
    { paymentInfo, soldItems: p_soldItems, totalPrice }: CreateIreceiptInputDto,
  ): Promise<CreateIreceiptOutPutDto> {
    let itemsList = [];

    const ok = await this.ireceipRepository.insert({
      paymentInfo,
      totalPrice,
      purchasedUser: user,
    });
    const ireceipt = await this.ireceipRepository.findOne(ok.identifiers[0].id);

    p_soldItems.forEach(({ payment, shipInfo, soldItemsInfo }) => {
      itemsList.push(
        this.CreateSoldItemById(user, {
          payment,
          sellUserInfo: soldItemsInfo.item.sellUserInfo,
          shipInfo,
          soldItemsInfo,
          Ireceipt: ireceipt,
        }),
      );
    });

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
        relations: ['sellUserInfo', 'purchasedUser'],
      });

      if (soldItem.sellUserInfo.id !== user.sellerInfo.id)
        return {
          ok: false,
          err: '소유자가 아닙니다.',
        };

      soldItem.status = status;

      transportNumber && (soldItem.transportNumber = transportNumber);

      // const ok = await this.soldItemRepository.save(soldItem);
      const ok = await this.soldItemRepository.update(soldItem.id, {
        ...soldItem,
      });

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
