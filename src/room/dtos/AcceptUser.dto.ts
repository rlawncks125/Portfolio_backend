import { IntersectionType, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { User } from 'src/user/entities/user.entity';
import { Room } from '../entities/room.entity';

export class AcceptUserInPutDto extends IntersectionType(
  PickType(Room, ['uuid'] as const),
  PickType(User, ['id'] as const),
) {}
export class AcceptUserOutPutDto extends CoreOutPut {}
