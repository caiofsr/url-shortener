import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentUserByContext = (ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) =>
  getCurrentUserByContext(ctx),
);
