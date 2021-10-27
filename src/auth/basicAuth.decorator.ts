import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const BasicAuth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const requst = context.switchToHttp().getRequest()['authoriztion'];

    return requst;
  },
);
