import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isArray } from 'class-validator';
import { ShopUser } from 'src/shop-user/entities/shop-user.entity';
// import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  // constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    // const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // if (!roles) {
    //   return true;
    // }

    const user = context.switchToHttp().getRequest()['user'];

    if (user) return true;

    return false;
  }
}

@Injectable()
export class ShopAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    // console.log(context.getHandler(), context.getClass());
    const user: ShopUser = context.switchToHttp().getRequest()['user'];

    if (!user) return false;

    const roles = this.reflector.get<string[]>(
      'shop-roles',
      context.getHandler(),
    );

    if (!roles || roles.includes('any')) {
      return true;
    }

    return roles.includes(user.role);
  }
}
