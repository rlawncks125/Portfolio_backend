import { PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Notification } from '../entities/Notification.entity';

export class ClearRegisterUserInputDto extends PickType(Notification, [
  'auth',
]) {}

export class ClearRegisterUserOutPutDto extends CoreOutPut {}
