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
    description: '주소 입니다.',
    example: '주소 입니다.',
  })
  @Column({ nullable: true, default: null })
  addr?: string;

  @ApiProperty({
    description: '핸드폰 번호입니다.',
    example: '핸드폰 번호입니다.',
  })
  @Column({ unique: true, nullable: true, default: null })
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
    type: () => [ShopIreceipt],
    description: '영수증',
    example: '영수증',
  })
  @OneToMany(() => ShopIreceipt, (ireceipt) => ireceipt.purchasedUser, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  Ireceipts: ShopIreceipt[];

  // save 되기 전 패스워드 해쉬 함수 를 이용하여 암호화
  @BeforeInsert()
  @BeforeUpdate()
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
