import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class Lating {
  @Column({ type: 'float' })
  @ApiProperty({ description: 'Lating_X', example: 'X 좌표입니다.' })
  X: number;

  @Column({ type: 'float' })
  @ApiProperty({ description: 'Lating_Y', example: 'Y 좌표입니다.' })
  Y: number;
}
