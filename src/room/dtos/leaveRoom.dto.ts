import { PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

export class LeaveRoomInput extends PickType(Room, ['uuid']) {}
export class LeaveRoomOutPut extends CoreOutPut {}
