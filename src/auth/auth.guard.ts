import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
