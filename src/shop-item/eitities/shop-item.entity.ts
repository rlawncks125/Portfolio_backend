import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { ShopUserSeller } from 'src/shop-user/entities/shop-user-seller.entity';
import { Column, Entity, JoinColumn, ManyToOne, VersionColumn } from 'typeorm';

class review {
  @ApiProperty({ description: '리뷰 제목', example: '리뷰 제목' })
  title: string;
  @ApiProperty({ description: '리뷰 내용', example: '리뷰 내용' })
  text: string;
  @ApiProperty({ description: '별점', example: '별점' })
  star: number;
  @ApiProperty({ description: '닉네임', example: '닉네임' })
  nickName: string;
  @ApiProperty({ description: '등록 날짜', example: '등록 날짜' })
  addDay: string;
}

class option {
  @ApiProperty({ description: '옵션 이름', example: '옵션 이름' })
  name: string;
  @ApiProperty({ description: '옵션 가격', example: '옵션 가격' })
  price: number;
}

class QA {
  @ApiProperty({ description: 'QA 제목', example: 'QA 제목' })
  title: string;
  @ApiProperty({ description: 'QA 내용', example: 'QA 내용' })
  text: string;
  @ApiProperty({ description: 'QA 상태', example: 'QA 상태' })
  status: string;
  @ApiProperty({ description: '등록한 닉네임', example: '등록한 닉네임' })
  nickName: string;
  @ApiProperty({ description: '등록한 날짜', example: '등록한 날짜' })
  addDay: string;
  @ApiProperty({ description: '문제 형태', example: '문제 형태' })
  type: string;
  @ApiProperty({ description: '답변', example: '답변' })
  answer?: string;
}

@Entity()
export class ShopItem extends CoreEntity {
  // 판매자 유저 정보
  @ApiProperty({
    type: () => ShopUserSeller,
    description: '판매유저 정보',
    example: '판매유저 정보',
  })
  @ManyToOne(() => ShopUserSeller, (user) => user.sellItems)
  @JoinColumn()
  sellUserInfo: ShopUserSeller;

  @ApiProperty({ description: 'title', example: '타이틀 제목' })
  @Column()
  title: string;

  @ApiProperty({ description: '가격', example: '가격' })
  @Column()
  price: number;

  @ApiProperty({ description: '할인가', example: '할인가' })
  @Column()
  sale: number;

  // 썸네일
  @ApiProperty({ description: '썸네일', example: '썸네일' })
  @Column()
  thumbnailSrc: string;

  // 제품 설명 이미지
  @ApiProperty({ description: '제품 설명 ', example: '제품 설명 ' })
  @Column(process.env.DB_TYPE === 'postgres' ? 'text' : 'longtext')
  detailHtml: string;

  // 옵션 ( 옵션명 , 금액 )
  @ApiProperty({ type: () => [option], description: '옵션 ', example: '옵션' })
  @Column({ type: 'json', nullable: true, default: null })
  options?: option[];

  // 배송비 ( 무료 , 금액 ...)
  @ApiProperty({ description: '배송비 ', example: '배송비 ' })
  @Column()
  parcel: number;

  @ApiProperty({ description: '무료 배송 금액', example: '무료 배송 금액' })
  @Column()
  freeParcel: number;

  // 원산지
  @ApiProperty({ description: '원산지', example: '원산지' })
  @Column()
  origin: string;

  // 구매후기 | 상품평 ( 갯수 , 평균 별)
  @ApiProperty({
    type: () => [review],
    description: '구매후기',
    example: '구매후기',
  })
  @Column({ type: 'json', nullable: true, default: null })
  reviews?: review[];

  // 상품문의
  @ApiProperty({
    type: () => [QA],
    description: '상품 문의',
    example: '상품 문의',
  })
  @Column({ type: 'json', nullable: true, default: null })
  QA?: QA[];
}

//
