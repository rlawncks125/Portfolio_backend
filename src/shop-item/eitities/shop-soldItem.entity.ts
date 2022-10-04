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

/**
 * Enum 배송 상태
 */
export enum Status {
  '결제완료',
  /**
   * 배송 정보 접수
   * informationReceived
   */
  '배송 정보 접수',
  /**
   * 화물접수
   * atPick
   */
  '화물접수',
  /**
   * 운송 업체 시설 도착
   * ArrivedAtCarrierFacility
   */
  '운송 업체 시설 도착',
  /**
   * 배송중
   * inTransit
   */
  '배송중',
  /**
   * 배송직전
   * outForDelivery
   */
  '배송직전',
  /**
   * 배송완료
   * delivered
   */
  '배송완료',
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
  Ireceipt: ShopIreceipt; // 영수증

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

  @ApiProperty({
    description: '배송 상태',
    isArray: true,
    enum: Status,
  })
  @Column({
    type: 'enum',
    enum: Status,
    default: Status['결제완료'],
  })
  // 배송 상태
  status: Status;

  // 운송 택배사

  @ApiProperty({
    description: '운송자 번호',
    example: '운송자 번호',
  })
  @Column({ default: null, nullable: true })
  // 운송자 번호
  transportNumber: string;
}
