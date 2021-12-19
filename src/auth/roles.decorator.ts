import { SetMetadata } from '@nestjs/common';

type RolesType = 'any' | 'user';

export const Roles = (roles: RolesType[]) => SetMetadata('roles', roles);
