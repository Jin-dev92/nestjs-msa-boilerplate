import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  BearerTokenMiddleware,
  EVENT_PATTERN_NAME,
  MESSAGE_PATTERN_NAME,
  MICROSERVICE_NAME,
} from '@libs/common';
import helmet from 'helmet';
import * as cors from 'cors';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICE_NAME.USER_SERVICE,
        transport: Transport.TCP,
      },
      // {
      //   name: '_SERVICE',
      //   transport: Transport.TCP,
      // },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors(), helmet()).forRoutes('*');
    consumer
      .apply(BearerTokenMiddleware)
      .exclude(
        {
          path: `/api/users/${MESSAGE_PATTERN_NAME.USER.LOGIN}`,
          method: RequestMethod.POST,
        },
        {
          path: `/api/users/${EVENT_PATTERN_NAME.USER.SIGN_UP}`,
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*');
  }
}
