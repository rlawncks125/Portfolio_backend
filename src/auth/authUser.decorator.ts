import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const authUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest()['user'];

    return user;
  },
);
