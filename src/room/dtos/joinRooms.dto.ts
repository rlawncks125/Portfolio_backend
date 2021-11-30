import { PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

export class JoinRoomInput extends PickType(Room, ['uuid']) {}

export class JoinRoomOutPut extends CoreOutPut {}
