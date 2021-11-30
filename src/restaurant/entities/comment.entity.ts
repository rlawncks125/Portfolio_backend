import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';

export class messageType {
  @CreateDateColumn()
  CreateTime?: Date;

  @Column()
  userName: string;

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
