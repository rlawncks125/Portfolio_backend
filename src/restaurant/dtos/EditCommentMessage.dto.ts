import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';

export class EditCommentMessageInPutDto {
  @ApiProperty({
    description: '댓글 id',
  })
  id: number;

  @ApiProperty({
    description: '변경할 내용',
  })
  message: string;
}

export class EditCommentMessageOutPutDto extends CoreOutPut {}
