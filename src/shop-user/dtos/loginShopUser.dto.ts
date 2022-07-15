import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';

export class LoginShopUserOutPut extends CoreOutPut {
  @ApiProperty({ description: '토큰', example: '토큰' })
  token?: string;
}
