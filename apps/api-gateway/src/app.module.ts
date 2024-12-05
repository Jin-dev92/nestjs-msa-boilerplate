import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  BearerTokenMiddleware,
  EVENT_PATTERN_NAME,
  Joi,
  MESSAGE_PATTERN_NAME,
  MICROSERVICE_NAME,
} from '@libs/common';

import * as cors from 'cors';
import helmet from 'helmet';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api-gateway/.env',
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.register([
      {
        name: MICROSERVICE_NAME.USER_SERVICE,
        transport: Transport.TCP,
      },
      {
        name: MICROSERVICE_NAME.CHAT_SERVICE,
        transport: Transport.TCP,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
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
