import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const WsQueryRunner = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();

    if (!client || !client.queryRunner) {
      throw new InternalServerErrorException('WsQueryRunner is not found');
    }
    return client.queryRunner;
  },
);
