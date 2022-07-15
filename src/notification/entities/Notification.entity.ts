import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Notification extends CoreEntity {
  @ApiProperty({
    description: '엔드 포인트 입니다.',
    example: '엔드포인트',
  })
  @Column({ type: 'longtext' })
  endPoint: string;

  @ApiProperty({
    description: 'endPoint 의 auth값 입니다.',
    example: 'endPoint의 auth값 입니다.',
  })
  @Column()
  auth: string;
}
