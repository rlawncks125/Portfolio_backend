import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

import { CoreEntity } from 'src/common/entities/core.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ShopUserSeller } from './shop-user-seller.entity';
import { ShopIreceipt } from 'src/shop-item/eitities/shop-ireceipt.entity';
import { BasketItem } from 'src/common/entities/bask-item';
import { ShopSoldItem } from 'src/shop-item/eitities/shop-soldItem.entity';

export enum ShopRole {
  'admin' = 'admin',
  'company' = 'company',
  'customer' = 'customer',
}

@Entity()
export class ShopUser extends CoreEntity {
  @ApiProperty({ description: 'password', example: '비밀 번호' })
  @Column()
  password: string;

  @ApiProperty({ description: '유저 아이디 입니다.', example: '유저 아이디' })
  @Column({ unique: true })
  userId: string;

  @ApiProperty({ description: '닉네임 입니다.', example: '닉네임' })
  @Column({ unique: true, nullable: true })
  nickName: string;

  @ApiProperty({
    description: '이메일 주소입니다.',
    example: '이메일 주소입니다.',
  })
  @Column({ unique: true, nullable: true, default: null })
  email: string;

  @ApiProperty({
    description: '역할',
    example: '역할',
    enum: [ShopRole.company, ShopRole.customer],
  })
  @Column({ type: 'enum', enum: ShopRole, default: ShopRole.customer })
  role?: ShopRole;

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
    description: '핸드폰 번호입니다.',
    example: '핸드폰 번호입니다.',
  })
  @Column({ nullable: true, default: null })
  tel: string;

  @ApiProperty({
    description: '우편전자 입니다.',
    example: '우편전자 입니다.',
  })
  @Column({ nullable: true, default: null })
  postcode: string;

  @ApiProperty({
    description: '장바구니 아이템 정보.',
    example: '장바구니 아이템 정보.',
    type: () => [BasketItem],
  })
  @Column({ default: null, type: 'json', nullable: true })
  basketItems: BasketItem[];

  @ApiProperty({
    type: () => ShopUserSeller,
    description: '판매자 정보',
    example: '판매자정보',
  })
  @OneToOne(() => ShopUserSeller, (seller) => seller.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  sellerInfo: ShopUserSeller;

  @ApiProperty({
    type: () => [ShopSoldItem],
    description: '구매한 아이템',
    example: '구매한 아이템',
  })
  @OneToMany(() => ShopSoldItem, (item) => item.purchasedUser, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  purchased: ShopSoldItem[];

  @ApiProperty({
    type: () => [ShopIreceipt],
    description: '영수증',
    example: '영수증',
  })
  @OneToMany(() => ShopIreceipt, (ireceipt) => ireceipt.purchasedUser, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  ireceipt: ShopIreceipt[];

  // save() 함수를 이용 를 하여 update할경우 호출
  // @BeforeUpdate()
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  // 받아오는 패스워드 비교
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return bcrypt.compare(aPassword, this.password);
    } catch (e) {
      return false;
    }
  }
}
