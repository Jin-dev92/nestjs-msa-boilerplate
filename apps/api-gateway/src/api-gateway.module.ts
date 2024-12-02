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
  MESSAGE_PATTERN_NAME,
  MICROSERVICE_NAME,
} from '@libs/common';
import helmet from 'helmet';
import cors from 'cors';

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
      .exclude({
        path: `users/${MESSAGE_PATTERN_NAME.USER.LOGIN}`,
        method: RequestMethod.POST,
      })
      .forRoutes('*');
  }
}
