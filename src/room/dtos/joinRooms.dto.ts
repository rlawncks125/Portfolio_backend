import { PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

export class JoinRoomInputDto extends PickType(Room, ['uuid']) {}

export class JoinRoomOutPutDto extends CoreOutPut {}
