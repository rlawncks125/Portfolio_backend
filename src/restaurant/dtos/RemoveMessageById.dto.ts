import { IntersectionType, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Comment, messageType } from '../entities/comment.entity';

export class RemoveMessageByIdOutPutDto extends CoreOutPut {}

export class RemoveMessageByParamsDto extends PickType(Comment, ['id']) {}

export class RemoveChildMessageInputDto extends IntersectionType(
  PickType(messageType, ['CreateTime'] as const),
  PickType(Comment, ['id'] as const),
) {}

export class RemoveChildMessageOutPutDto extends CoreOutPut {}
