import { SetMetadata } from '@nestjs/common';
import { ShopRole } from 'src/shop-user/entities/shop-user.entity';

type RolesType = 'any' | 'user';

export const Roles = (roles: RolesType[]) => SetMetadata('roles', roles);

type ShopRolesType = keyof typeof ShopRole | 'any';
export const ShopRoles = (roles: ShopRolesType[]) =>
  SetMetadata('shop-roles', roles);
