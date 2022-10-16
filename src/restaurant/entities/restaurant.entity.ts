import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional, isString, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Lating } from 'src/common/entities/Lating.entity';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';

class SuperUserDto {
  @ApiProperty({ description: '유저 아이디' })
  @Column()
  id: number;

  @ApiProperty({ description: '유저 닉네임' })
  @Column()
  nickName: string;
}

@Entity()
export class Restaurant extends CoreEntity {
  // 소유자
  @ApiProperty({
    description: '소유자',
    example: '소유자',
  })
  @Column(() => SuperUserDto)
  resturantSuperUser?: SuperUserDto | null;

  // 상호명
  @ApiProperty({
    description: '음식점 이름입니다.',
    example: '음식점 이름',
  })
  @Column()
  restaurantName: string;

  // 이미지
  @ApiProperty({
    description: '음식점 이미지 url 입니다',
    example: 'imageUrl',
    nullable: true,
  })
  @Column('json', { nullable: true })
  @IsOptional()
  restaurantImageUrl?: string | null;

  // 지역명
  @ApiProperty({
    description: '위치한 지역입니다.',
    example: '지역',
  })
  @Column()
  location: string;

  // 댓글 ( 댓글 테이블 )
  @ApiProperty({
    description: '댓글들 입니다.',
    example: '댓글들',
    type: () => [Comment],
  })
  @OneToMany(() => Comment, (comment) => comment.parentRestaurant, {
    eager: true,
  })
  @IsOptional()
  comments?: Comment[];

  // 평균 별점
  @ApiProperty({
    description: '평균 별점',
    example: '평균 별점',
  })
  @Column({ type: 'float', default: 0 })
  @IsOptional()
  avgStar?: number;

  // 좌표 ( Postion )
  @ApiProperty({
    description: '좌표입니다.',
    type: () => Lating,
  })
  @Column(() => Lating)
  lating: Lating;

  //  소속방 ( 방테이블 )
  @ApiProperty({
    description: '소속한 방정보입니다.',
    example: '소속한 방',
    type: () => Room,
  })
  @ManyToOne(() => Room, (room) => room.restaurants, { onDelete: 'CASCADE' })
  parentRoom: Room;

  // 해시태그
  @ApiProperty({
    description: '해시태그들',
    type: () => [String],
  })
  @Column('json', { default: '[]', nullable: true })
  hashTags?: string[] | null;

  // 전문분야
  @ApiProperty({
    description: '전문분야',
    type: () => [String],
  })
  @Column('json', { default: '[]', nullable: true })
  specialization?: string[] | null;

  //   별점 평균 계산

  avgStarUpdate(): number {
    const star = this.comments.map((v) => v.star).reduce((a, b) => a + b, 0.0);

    if (this.comments.length <= 0) return 0;

    return star / this.comments.length;
  }

  // 삭제시 평점 갱신
  removeCommentUpdateAvgStarById(deleteIndex: number): number {
    const remainComments = this.comments
      .filter((v) => v.id !== deleteIndex)
      .map((v) => v.star);

    const star = remainComments.reduce((a, b) => a + b, 0.0);

    if (remainComments.length <= 0) return 0;

    return star / remainComments.length;
  }
}
