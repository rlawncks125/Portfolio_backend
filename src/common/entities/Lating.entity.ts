import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class Lating {
  @Column({ type: 'float8' })
  @ApiProperty({ description: 'Lating_X', example: 'X 좌표입니다.' })
  x: number;

  @Column({ type: 'float8' })
  @ApiProperty({ description: 'Lating_Y', example: 'Y 좌표입니다.' })
  y: number;
}
