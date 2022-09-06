import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CoreEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id', example: 'id' })
  id?: number;

  @ApiProperty({ description: '생성한 날짜', example: '생성한 날짜' })
  @CreateDateColumn()
  createAt?: Date;

  @ApiProperty({ description: '갱신한 날짜', example: '갱신한 날짜' })
  @UpdateDateColumn()
  updateAt?: Date;
}
