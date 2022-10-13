import { PartialType, PickType } from '@nestjs/swagger';

import { User } from '../entities/user.entity';

export class UserUpdateInputDto extends PartialType(
  PickType(User, ['password', 'dsc', 'avatar'] as const),
) {}
