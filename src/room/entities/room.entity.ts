import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Lating } from 'src/common/entities/Lating.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Room extends CoreEntity {
  @ApiProperty({ description: '방고유아이디입니다.', example: 'room_UUID' })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({ description: '방 이름입니다..', example: 'roomName' })
  @Column()
  roomName: string;

  @ApiProperty({ description: '방 시작 좌표입니다.', type: () => Lating })
  @Column(() => Lating)
  lating: Lating;

  @ApiProperty({
    description: '만든 유저입니다.',
    example: '만든 유저입니다.',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.makeRoom)
  makerUser: User;

  @ApiProperty({
    description: '참가한 유저들입니다.',
    example: '[참가한 유저들입니다.]',
    type: () => [User],
  })
  @ManyToMany(() => User, (user) => user.joinRooms)
  @JoinTable()
  joinUsers: User[];

  @ApiProperty({
    description: '레스토랑 정보들',
    example: '레스토랑 정보들',
    type: () => [Restaurant],
  })
  @OneToMany(() => Restaurant, (restaurant) => restaurant.parentRoom)
  restaurants: Restaurant[];
}
