import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

class approvalWaitRoomInfo extends PickType(Room, [
  'id',
  'roomName',
] as const) {}

export class myApprovalWaitRoomsOutPutDto extends CoreOutPut {
  @ApiProperty({
    description: '룸정보',
    type: () => [approvalWaitRoomInfo],
  })
  rooms?: approvalWaitRoomInfo[];
}
