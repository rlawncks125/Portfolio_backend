import { PartialType, PickType, IntersectionType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

export class EditRoomInPutDto extends IntersectionType(
  PickType(Room, ['uuid'] as const),
  PartialType(PickType(Room, ['roomName', 'superUser', 'lating'] as const)),
) {}

export class EdtiRoomOutPutDto extends CoreOutPut {}
