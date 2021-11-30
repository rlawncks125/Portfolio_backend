import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CoreEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id', example: 'id' })
  id?: number;

  @CreateDateColumn()
  createAt?: Date;

  @UpdateDateColumn()
  updateAt?: Date;
}
