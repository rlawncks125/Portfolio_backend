import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest()['user'];

    if (user) return true;

    return false;
  }
}
