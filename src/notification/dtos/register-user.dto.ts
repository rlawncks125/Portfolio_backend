import { ApiProperty } from '@nestjs/swagger';
import { CoreOutPut } from 'src/common/dtos/output.dto';

export class RegistersubscriptionUserInputDto {
  @ApiProperty({
    description: 'userId',
    example: 'userId',
  })
  userId: number;

  @ApiProperty({
    description: 'auth',
    example: 'auth',
  })
  auth: string;
}

export class RegistersubscriptionUserOutPutDto extends CoreOutPut {}
