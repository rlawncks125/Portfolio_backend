import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

import { CoreEntity } from 'src/common/entities/core.entity';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Room } from 'src/room/entities/room.entity';

@Entity()
export class User extends CoreEntity {
  @ApiProperty({ description: 'password', example: '비밀 번호' })
  @Column()
  password: string;

  @ApiProperty({ description: '유저 이름입니다.', example: '유저 이름' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: '내용물', example: '내용' })
  @Column({ default: '' })
  dsc: string;

  @ApiProperty({ description: '아바타', example: '아바타' })
  @Column({ default: null, nullable: true })
  avatar: string;

  @ApiProperty({ description: '테마', example: '테마' })
  @Column({ default: null, nullable: true })
  theme: string;

  @ApiProperty({ description: '권한 있는 방들', example: '권한 있는 방들' })
  @OneToMany(() => Room, (room) => room.superUser)
  superRooms: Room[];

  @ManyToMany(() => Room, (room) => room.joinUsers)
  joinRooms: Room[];

  @ManyToMany(() => Room, (room) => room.approvalWaitUsers)
  approvalWaitRooms: Room[];

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
