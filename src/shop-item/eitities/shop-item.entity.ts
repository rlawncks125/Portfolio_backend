import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ShopItem extends CoreEntity {
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
  @Column()
  detailHtml: string;
}
