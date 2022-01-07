import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

class Postion {
  @ApiProperty({
    description: 'Lating X 좌표입니다.',
  })
  x: number;
  @ApiProperty({
    description: 'Lating Y 좌표입니다.',
  })
  y: number;
}

export class WSCreateRoomDtoInput {
  @ApiProperty({
    description: '방 제목 입니다.',
    required: true,
  })
  @IsString()
  room: string;

  @ApiProperty({
    description: '방 시작 좌표입니다.',
  })
  position: Postion;
}

export class CreateRoomDtoOutPut {
  @ApiProperty({
    description: '성공 여부입니다.',
    required: true,
  })
  @IsBoolean()
  ok: boolean;

  @ApiProperty({
    description: '메세지 입니다.',
  })
  message: string;

  @ApiProperty({
    description: 'Room 정보입니다.',
  })
  room: string;
}
