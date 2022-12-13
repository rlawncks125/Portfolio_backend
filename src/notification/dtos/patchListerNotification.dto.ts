import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { Notification } from '../entities/Notification.entity';

export class PatchListerNotificationInputDto extends PickType(Notification, [
  'auth',
]) {}

export class PatchListerNotificationOutPutDto extends CoreOutPut {
  @ApiProperty({
    description: '알림 설정 여부',
    example: '알림 설정 여부',
    required: false,
  })
  isPusb?: boolean;
}
