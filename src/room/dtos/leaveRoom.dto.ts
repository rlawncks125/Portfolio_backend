import { PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

export class LeaveRoomInputDto extends PickType(Room, ['uuid']) {}
export class LeaveRoomOutPutDto extends CoreOutPut {}
