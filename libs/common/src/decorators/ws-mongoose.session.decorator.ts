import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const WsMongooseSession = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();

    if (!client || !!client.data || !client.data.mongooseSession) {
      throw new InternalServerErrorException('WsMongooseSession is not found');
    }
    return client.data.mongooseSession;
  },
);
