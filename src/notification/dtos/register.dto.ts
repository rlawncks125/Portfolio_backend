import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';
import { PushSubscription } from 'web-push';

export class RegistersubscriptionInputDto {
  @ApiProperty({
    description: 'Subscription',
    example: 'Subscription',
  })
  subscription: any;
}

export class RegistersubscriptionOutPutDto extends CoreOutPut {}
