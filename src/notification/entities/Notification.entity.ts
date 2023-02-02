import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

/** webpush PlayLoad */
export class NotificationPayLoad {
  /** 알람 제목 */
  @ApiProperty({
    description: '알람 제목',
    example: '알람 제목',
  })
  title: string;

  /** 알람 내용 */
  @ApiProperty({
    description: '알람 내용',
    example: '알람 내용',
  })
  body: string;

  /** 방 UUID */
  @ApiProperty({
    description: '방 UUID',
    example: '방 UUID',
  })
  uuid: string;
}

/** webpush PlayLoad */
export class ShopNotificationPayLoad {
  /** 알람 제목 */
  @ApiProperty({
    description: '알람 제목',
    example: '알람 제목',
  })
  title: string;

  /** 알람 내용 */
  @ApiProperty({
    description: '알람 내용',
    example: '알람 내용',
  })
  body: string;

  /** 운송사 정보 */
  @ApiProperty({
    description: '운송사 정보',
    example: '운송사 정보',
    required: false,
  })
  transportNumber?: string;
}

@Entity()
export class Notification extends CoreEntity {
  @ApiProperty({
    description: 'subscription 입니다.',
    example: 'subscription',
  })
  @Column({ type: process.env.DB_TYPE === 'postgres' ? 'text' : 'longtext' })
  subscription: string;

  @ApiProperty({
    description: 'subscription 의 auth값 입니다.',
    example: 'subscription 의 auth값 입니다.',
  })
  @Column()
  auth: string;

  @ApiProperty({
    description: '등록된 유저 아이디 입니다.',
    example: '등록된 유저 아이디 입니다.',
  })
  @Column({
    nullable: true,
    default: null,
  })
  userId: number;

  @ApiProperty({
    description: '등록된 shop 유저 아이디 입니다.',
    example: '등록된 shop 유저 아이디 입니다.',
  })
  @Column({
    nullable: true,
    default: null,
  })
  shopUserId: number;

  @ApiProperty({
    description: '알림 받기 설정',
    example: '알림 받기 설정',
  })
  @Column({
    default: true,
  })
  isPush: boolean;
  @ApiProperty({
    description: 'shop 알림 받기 설정',
    example: 'shop 알림 받기 설정',
  })
  @Column({
    default: true,
  })
  shopIsPush: boolean;
}
