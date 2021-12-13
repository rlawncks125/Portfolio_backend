import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';

export enum MessageUserRole {
  User = 'User',
  Anonymous = 'Anonymous',
}

class UserCommentInfo {
  @ApiProperty({
    description: '닉네임',
    example: '닉네임',
  })
  @Column()
  nickName: string;

  @ApiProperty({
    description: '유저 or 익명 확인',
    example: '유저 or 익명 확인',
    enum: MessageUserRole,
  })
  @Column({ type: 'enum', enum: MessageUserRole })
  role: MessageUserRole;
}

export class messageType {
  @ApiProperty({
    description: '댓글 작성 시간',
    example: '댓글 작성 시간',
  })
  @CreateDateColumn()
  CreateTime: Date;

  @ApiProperty({
    description: 'user정보',
    example: 'user정보',
    type: () => UserCommentInfo,
  })
  @Column(() => UserCommentInfo)
  userInfo: UserCommentInfo;

  @ApiProperty({
    description: '댓글 내용',
    example: '댓글 내용',
  })
  @Column()
  message: string;
}

@Entity()
export class Comment extends CoreEntity {
  @ApiProperty({
    description: '부모 테이블',
    example: '부모 테이블',
    type: () => Restaurant,
  })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.comments)
  parentRestaurant: Restaurant;

  @ApiProperty({
    description: '별점입니다.',
    example: '별점',
  })
  @Column({ type: 'float' })
  star: number;

  @ApiProperty({
    description: '메세지',
    example: '메세지',
    type: () => messageType,
  })
  @Column(() => messageType)
  message: messageType;

  @ApiProperty({
    description: '추가 댓글들',
    example: '추가 댓글들',
    type: () => [messageType],
  })
  @Column({ type: 'json', nullable: true })
  @IsOptional()
  childMessages?: messageType[];
}
