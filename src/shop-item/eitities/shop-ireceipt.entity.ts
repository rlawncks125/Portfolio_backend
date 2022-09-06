import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { ShopUserSeller } from 'src/shop-user/entities/shop-user-seller.entity';
import { ShopUser } from 'src/shop-user/entities/shop-user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { ShopSoldItem } from './shop-soldItem.entity';

class PayMentInfo {
  @ApiProperty({ description: '결제 방식', example: '결제 방식' })
  pay_method: string;

  @ApiProperty({ description: '카드사', example: '카드사' })
  card_name: string;

  @ApiProperty({ description: '카드번호', example: '카드번호' })
  card_number: string;

  @ApiProperty({ description: '결제 금액', example: '결제 금액' })
  paymentPrice: number; // 결제한 금액
}

// 영수중
@Entity()
export class ShopIreceipt extends CoreEntity {
  @ApiProperty({
    type: () => ShopUser,
    description: '구매 유저',
    example: '구매 유저',
  })
  @ManyToOne(() => ShopUser, (user) => user.ireceipt)
  @JoinColumn()
  purchasedUser: ShopUser; // 구매한 유저 정보

  @ApiProperty({
    type: () => [ShopSoldItem],
    description: '판매된 아이템 정보',
    example: '판매된 아이템 정보',
  })
  @OneToMany(() => ShopSoldItem, (soldItem) => soldItem.Ireceipt)
  soldItems: ShopSoldItem[];

  @ApiProperty({
    type: () => PayMentInfo,
    description: '결제 정보',
    example: '결제 정보',
  })
  @Column('json')
  paymentInfo: PayMentInfo;

  @ApiProperty({
    description: '총결제 금액',
    example: '총결제 금액',
  })
  @Column()
  totalPrice: number;
}
