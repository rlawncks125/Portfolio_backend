import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class Lating {
  @Column({ type: process.env.NODE_ENV === 'production' ? 'float8' : 'double' })
  @ApiProperty({ description: 'Lating_X', example: 'X 좌표입니다.' })
  x: number;

  @Column({ type: process.env.NODE_ENV === 'production' ? 'float8' : 'double' })
  @ApiProperty({ description: 'Lating_Y', example: 'Y 좌표입니다.' })
  y: number;
}
