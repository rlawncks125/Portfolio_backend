import { ApiProperty, OmitType } from '@nestjs/swagger';
import { BaksetItemSelectedOptions } from 'src/common/entities/bask-item';
import { CoreEntity } from 'src/common/entities/core.entity';
import { ShopUserSeller } from 'src/shop-user/entities/shop-user-seller.entity';
import { ShopUser } from 'src/shop-user/entities/shop-user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ShopIreceipt } from './shop-ireceipt.entity';
import { ShopItem } from './shop-item.entity';

export class SolidItemInfo {
  @ApiProperty({
    type: () => ShopItem,
    description: '아이템 정보 ',
    example: '아이템 정보',
  })
  item: ShopItem;

  @ApiProperty({
    type: () => [BaksetItemSelectedOptions],
    description: '옵션 구매 갯수 ',
    example: '옵션 구매 갯수',
  })
  selectedOptions: BaksetItemSelectedOptions[];
}

class ShipInfo {
  @ApiProperty({
    description: '도로명 주소 입니다.',
    example: '도로명 주소 입니다.',
  })
  @Column({ nullable: true, default: null })
  address?: string;

  @ApiProperty({
    description: '상세 주소 입니다.',
    example: '상세 주소 입니다.',
  })
  @Column({ nullable: true, default: null })
  addressDetail?: string;

  @ApiProperty({
    description: '우편전자 입니다.',
    example: '우편전자 입니다.',
  })
  @Column({ nullable: true, default: null })
  postcode: string;
}

@Entity()
export class ShopSoldItem extends CoreEntity {
  @ApiProperty({
    type: () => ShopUserSeller,
    description: '판매 유저',
    example: '판매 유저',
  })
  @ManyToOne(() => ShopUserSeller, (sell) => sell.soldItem)
  @JoinColumn()
  sellUserInfo: ShopUserSeller; // 판매자 유저 정보

  @ApiProperty({
    type: () => ShopUser,
    description: '구매 유저',
    example: '구매 유저',
  })
  @ManyToOne(() => ShopUser, (user) => user.purchased)
  @JoinColumn()
  purchasedUser: ShopUser; // 구매한 유저 정보

  @ApiProperty({
    type: () => ShopIreceipt,
    description: '영수증',
    example: '영수증',
  })
  @ManyToOne(() => ShopIreceipt, (user) => user.soldItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  Ireceipt: ShopIreceipt; // 구매한 유저 정보

  @ApiProperty({
    type: () => SolidItemInfo,
    description: '구매한 아이템 정보',
    example: '구매한 아이템 정보',
  })
  @Column('json')
  soldItemsInfo: SolidItemInfo;

  @ApiProperty({
    description: '결제 가격',
    example: '결제 가격',
  })
  @Column()
  // 결제 가격
  payment: number;

  @ApiProperty({
    type: () => ShipInfo,
    description: '배송 정보',
    example: '배송 정보',
  })
  @Column('json')
  // 배송정보
  shipInfo: ShipInfo;
}
