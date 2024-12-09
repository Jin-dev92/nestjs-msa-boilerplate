import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  BearerTokenMiddleware,
  Joi,
  MICROSERVICE_NAME,
  UserMicroService,
} from '@libs/common';

import * as cors from 'cors';
import helmet from 'helmet';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EncryptionModule } from '@libs/encryption';
import { join } from 'path';

@Module({
  imports: [
    EncryptionModule,
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
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: MICROSERVICE_NAME.USER_SERVICE,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: UserMicroService.protobufPackage,
              protoPath: join(process.cwd(), UserMicroService.USER_PROTO_PATH),
            },
          }),
        },
        // {
        //   name: MICROSERVICE_NAME.CHAT_SERVICE,
        //   inject: [ConfigService],
        //   useFactory: (configService: ConfigService) => ({
        //     transport: Transport.RMQ,
        //     options: {
        //       urls: [
        //         // `amqp://rabbitmq:${configService.getOrThrow<number>(ENVIRONMENT_KEYS.USER_SERVICE_TCP_PORT)}`,
        //         `amqp://rabbitmq:5672`,
        //       ],
        //       queue: 'chat_queue',
        //       queueOptions: {
        //         durable: false,
        //       },
        //     },
        //   }),
        // },
      ],
    }),
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
          path: `/auth/login`,
          method: RequestMethod.POST,
        },
        {
          path: '/users',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*');
  }
}
