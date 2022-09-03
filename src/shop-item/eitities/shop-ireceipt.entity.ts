import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { ShopUserSeller } from 'src/shop-user/entities/shop-user-seller.entity';
import { ShopUser } from 'src/shop-user/entities/shop-user.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { BasketItem } from '../../common/entities/bask-item';

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
    type: () => ShopUserSeller,
    description: '판매 유저',
    example: '판매 유저',
  })
  @ManyToOne(() => ShopUserSeller, (sell) => sell.Ireceipt)
  @JoinColumn()
  sellUserInfo: ShopUserSeller; // 판매자 유저 정보

  @ApiProperty({
    type: () => ShopUser,
    description: '구매 유저',
    example: '구매 유저',
  })
  @ManyToOne(() => ShopUser, (user) => user.Ireceipts)
  @JoinColumn()
  purchasedUser: ShopUser; // 구매한 유저 정보

  @ApiProperty({
    type: () => [BasketItem],
    description: '아아템 목록',
    example: '아아템 목록',
  })
  @Column('json')
  Items: BasketItem[];

  @ApiProperty({
    type: () => PayMentInfo,
    description: '결제 정보',
    example: '결제 정보',
  })
  @Column('json')
  paymentInfo: PayMentInfo;
}
