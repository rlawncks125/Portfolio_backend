import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';

export class AnswerQAInputDto {
  @ApiProperty({ description: '아이템 아이디', example: '아이템 아이디' })
  itemId: number;

  @ApiProperty({ description: '추가 날짜', example: '추가 날짜' })
  addDay: string;

  @ApiProperty({ description: '답변', example: '답변' })
  answer: string;
}

export class AnswerQAOutPutDtop extends CoreOutPut {}
