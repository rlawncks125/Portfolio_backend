import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { ShopIreceipt } from 'src/shop-item/eitities/shop-ireceipt.entity';
import { ShopItem } from 'src/shop-item/eitities/shop-item.entity';
import { Column, Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { ShopUser } from './shop-user.entity';

@Entity()
export class ShopUserSeller extends CoreEntity {
  @OneToOne(() => ShopUser, (user) => user.sellerInfo)
  user: ShopUser;

  @ApiProperty({ description: '대표자', example: '대표자' })
  @Column()
  represent: string; //대표자

  @ApiProperty({ description: '핸드폰 번호', example: '핸드폰 번호' })
  @Column()
  phone: string;

  @ApiProperty({ description: '이메일 주소', example: '이메일 주소' })
  @Column()
  eMail: string;

  @ApiProperty({ description: '회사명', example: '회사명' })
  @Column({ unique: true })
  companyName: string;

  @ApiProperty({ description: '회사주소', example: '회사주소' })
  @Column()
  companyAddress: string;

  @ApiProperty({
    type: () => [ShopItem],
    description: '판매중인 아이템',
    example: '판매중인 아이템',
  })
  @OneToMany(() => ShopItem, (item) => item.sellUserInfo, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  sellItems: ShopItem[];

  @ApiProperty({
    type: () => [ShopIreceipt],
    description: '영수증',
    example: '영수증',
  })
  @OneToMany(() => ShopIreceipt, (ireceipt) => ireceipt.sellUserInfo, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  Ireceipt: ShopIreceipt[];
}
