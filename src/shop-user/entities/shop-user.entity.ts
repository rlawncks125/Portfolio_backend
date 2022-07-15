import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

import { CoreEntity } from 'src/common/entities/core.entity';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ description: '역할', example: '역할' })
  @Column({ type: 'enum', enum: ShopRole, default: ShopRole.customer })
  role?: ShopRole;

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
