import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CoreOutPut {
  @ApiProperty({
    type: Boolean,
    description: '성공 여부입니다.',
  })
  @IsBoolean()
  ok: boolean;

  @ApiProperty({
    type: String,
    description: '에러 메세지입니다.',
    example: '에러',
    required: false,
  })
  @IsString()
  @IsOptional()
  err?: string;
}
