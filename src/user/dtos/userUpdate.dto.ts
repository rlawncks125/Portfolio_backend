import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({
    required: false,
    description: 'user password 입력하는곳입니다.',
    type: () => String,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  dsc?: string;
}
