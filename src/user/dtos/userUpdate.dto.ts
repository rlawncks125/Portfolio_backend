import { PartialType, PickType } from '@nestjs/swagger';

import { User } from '../entities/user.entity';

export class UserUpdateDto extends PartialType(
  PickType(User, ['password', 'dsc']),
) {}
