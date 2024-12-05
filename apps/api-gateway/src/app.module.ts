import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  BearerTokenMiddleware,
  ENVIRONMENT_KEYS,
  EVENT_PATTERN_NAME,
  Joi,
  MESSAGE_PATTERN_NAME,
  MICROSERVICE_NAME,
} from '@libs/common';

import * as cors from 'cors';
import helmet from 'helmet';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api-gateway/.env',
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        USER_SERVICE_HOST: Joi.string().required(),
        USER_SERVICE_TCP_PORT: Joi.number().required(),
        CHAT_SERVICE_HOST: Joi.string().required(),
        CHAT_SERVICE_TCP_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: MICROSERVICE_NAME.USER_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get(ENVIRONMENT_KEYS.USER_SERVICE_HOST),
            port: parseInt(
              configService.get(ENVIRONMENT_KEYS.USER_SERVICE_TCP_PORT),
            ),
          },
        }),
      },
      {
        name: MICROSERVICE_NAME.CHAT_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get(ENVIRONMENT_KEYS.CHAT_SERVICE_HOST),
            port: parseInt(
              configService.get(ENVIRONMENT_KEYS.CHAT_SERVICE_TCP_PORT),
            ),
          },
        }),
      },
    ]),
    ChatModule,
    AuthModule,
    UserModule,
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
