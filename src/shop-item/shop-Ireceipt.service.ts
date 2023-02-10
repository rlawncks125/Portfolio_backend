import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { ShopUser } from 'src/shop-user/entities/shop-user.entity';
import { Like, Repository } from 'typeorm';

import { ShopIreceipt } from './eitities/shop-ireceipt.entity';
import {
  CreateIreceiptInputDto,
  CreateIreceiptOutPutDto,
} from './dtos/ineceipt/create-ireceipt.dto';
import { CreateSolidItemInPutDto } from './dtos/ineceipt/create-solditem.dto';
import { ShopSoldItem, Status } from './eitities/shop-soldItem.entity';
import { GetIreceiptOutPutDto } from './dtos/ineceipt/get-ireceipt.dto';
import { GetSoldItemsOutPutDto } from './dtos/ineceipt/get-solditems.dto';
import {
  PatchSoldItemInputDto,
  PatchSoldItemOutputDto,
} from './dtos/patch-solditem.dto';
import { ShopUserService } from 'src/shop-user/shop-user.service';
import { ShopItem } from './eitities/shop-item.entity';
import { AddReivewOutPutDto, AddReviewInputDto } from './dtos/add-review.dto';
import axios from 'axios';
import { CellStyles, Excel4Node } from 'src/lib/excel4node';
import { NotificationService } from 'src/notification/notification.service';
import { GetSalseItemsOutPutDto } from './dtos/getSalesItems.dto';

@Injectable()
export class ShopIreceiptService {
  constructor(
    @InjectRepository(ShopIreceipt)
    private readonly ireceipRepository: Repository<ShopIreceipt>,
    @InjectRepository(ShopSoldItem)
    private readonly soldItemRepository: Repository<ShopSoldItem>,
    @InjectRepository(ShopItem)
    private readonly ItemRepository: Repository<ShopItem>,
    private readonly appService: AppService,
    private readonly shopUserService: ShopUserService,
    private readonly notificationService: NotificationService,
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
    try {
      let itemsList = [];

      const ok = await this.ireceipRepository.insert({
        paymentInfo,
        totalPrice,
        purchasedUser: user,
      });
      const ireceipt = await this.ireceipRepository.findOne(
        ok.identifiers[0].id,
      );

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

      // 구매한 장바구니 아이템 제거
      // 추후 장바구니 index를 추가하여 선택한 아이템만 구매할수있게 구현

      this.shopUserService.removeBasketItem(user, {
        itemIndex: Array.from(
          { length: p_soldItems.length },
          (v, index) => index,
        ),
      });

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
  async getSalesItems(user: ShopUser): Promise<GetSalseItemsOutPutDto> {
    const items = await this.ItemRepository.find({
      where: {
        sellUserInfo: user.sellerInfo,
      },
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

      switch (soldItem.status) {
        case Status.결제완료:
          this.notificationService.pushShopNotificationByUserId(
            soldItem.sellUserInfo.id,
            {
              title: `${soldItem.purchasedUser.nickName}님이 상품을 구매하였습니다.`,
              body: `결제가 들어왔습니다.`,
            },
          );
          break;
        case Status['배송 정보 접수']:
          this.notificationService.pushShopNotificationByUserId(
            +soldItem.purchasedUser.id,
            {
              title: `${soldItem.soldItemsInfo.item.title}`,
              body: '배송을 접수 하였습니다.',
            },
          );
          break;
        case Status.화물접수:
          this.notificationService.pushShopNotificationByUserId(
            +soldItem.purchasedUser.id,
            {
              title: `${soldItem.soldItemsInfo.item.title} 화물을 접수 하였습니다,`,
              body: `${soldItem.transportNumber} 접수 하였습니다.`,
              transportNumber: soldItem.transportNumber,
            },
          );
          break;
        case Status['운송 업체 시설 도착']:
          this.notificationService.pushShopNotificationByUserId(
            +soldItem.purchasedUser.id,
            {
              title: `${soldItem.soldItemsInfo.item.title}`,
              body: `운송 업체 시설에 도착 하였습니다.`,
            },
          );
          break;
        case Status.배송중:
          this.notificationService.pushShopNotificationByUserId(
            +soldItem.purchasedUser.id,
            {
              title: `${soldItem.soldItemsInfo.item.title}`,
              body: `배송을 시작하였습니다..`,
            },
          );
          break;
        case Status.배송직전:
          this.notificationService.pushShopNotificationByUserId(
            +soldItem.purchasedUser.id,
            {
              title: `${soldItem.soldItemsInfo.item.title}`,
              body: `곧 도착 합니다.`,
            },
          );
          break;
        case Status.배송완료:
          this.notificationService.pushShopNotificationByUserId(
            +soldItem.purchasedUser.id,
            {
              title: `${soldItem.soldItemsInfo.item.title}`,
              body: `배송 완료 하였습니다.`,
            },
          );
          break;
        default:
          break;
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

  async addReivew(
    user: ShopUser,
    { soldId, star, text, title, selectedOptions }: AddReviewInputDto,
  ): Promise<AddReivewOutPutDto> {
    try {
      const soldItem = await this.soldItemRepository.findOne(
        { id: soldId },
        {
          relations: ['purchasedUser'],
        },
      );

      if (soldItem.isReview) {
        return {
          ok: false,
          err: '이미 리뷰을 달았습니다.',
        };
      }

      if (soldItem.purchasedUser.id !== user.id) {
        return {
          ok: false,
          err: '구매자가 아닙니다.',
        };
      }

      const item = await this.ItemRepository.findOne({
        id: soldItem.soldItemsInfo.item.id,
      });

      if (!item) {
        return {
          ok: false,
          err: '아이템이 존재하지 않습니다.',
        };
      }

      item.updateAt = new Date();

      item.reviews = [
        ...item.reviews,
        {
          addDay: new Date().toLocaleDateString(),
          nickName: user.nickName,
          star,
          text,
          title,
          selectedOptions,
        },
      ];

      const ok = await this.ItemRepository.update(item.id, item);

      if (!ok) {
        return {
          ok: false,
          err: '반영하지 못했습니다.',
        };
      }

      await this.soldItemRepository.update(soldId, {
        isReview: true,
      });

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

  // 크론 작업 예정
  // 엑셀 데이터 생성
  async writeIreceiptExcel() {
    const wb = new Excel4Node();
    const ws = wb.addWorkSheet('아이템 등록 기록');
    const ws2 = wb.addWorkSheet('영수증 기록');

    const items = await this.ItemRepository.find();
    const ireceipts = await this.ireceipRepository.find({});

    wb.registe(ws, items, {});

    wb.registe(ws2, ireceipts, {});

    return wb.write(
      `데이터 저장 ${new Intl.DateTimeFormat('ko-kr', {
        dateStyle: 'medium',
      }).format(new Date())}`,
    );
  }
}
