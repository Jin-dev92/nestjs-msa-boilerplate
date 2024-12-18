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
  traceInterceptor,
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
import { HealthModule } from './health/health.module';

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
              channelOptions: {
                interceptors: [traceInterceptor('gateway')],
              },
              package: UserMicroService.protobufPackage,
              protoPath: join(process.cwd(), 'proto/user.proto'),
            },
          }),
        },
        // {
        //   name: MICROSERVICE_NAME.CHAT_SERVICE,
        //   inject: [ConfigService],
        //   useFactory: (configService: ConfigService) => ({
        //     transport: Transport.GRPC,
        //     options: {
        //       channelOptions: {
        //         interceptors: [traceInterceptor('gateway')],
        //       },
        //       package: UserMicroService.protobufPackage,
        //       protoPath: join(process.cwd(), 'proto/user.proto'),
        //     },
        //   }),
        // },
      ],
    }),
    ChatModule,
    AuthModule,
    UserModule,
    HealthModule,
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
        {
          path: '/health',
          method: RequestMethod.GET,
        },
      )
      .forRoutes('*');
  }
}
