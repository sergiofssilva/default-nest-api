import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface reqType {
  user: string;
}

export const CurrentAccount = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req: reqType = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
