import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';

export class EditCommentChildMessageInPutDto {
  @ApiProperty({ description: '댓글 아이디' })
  id: number;

  @ApiProperty({ description: '변경할 메세지 생성 시간' })
  createTime: Date;

  @ApiProperty({ description: '변경할 내용' })
  message: string;
}

export class EditCommentChildMessageOutPutDto extends CoreOutPut {}
