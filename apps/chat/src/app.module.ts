import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ENVIRONMENT_KEYS,
  Joi,
  MICROSERVICE_NAME,
  traceInterceptor,
  UserMicroService,
} from '@libs/common';
import { ChatModule } from './chat/chat.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>(ENVIRONMENT_KEYS.DATABASE_URL),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/chat/.env',
      validationSchema: Joi.object({
        GRPC_CHAT_SERVICE_URL: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        MONGOOSE_USER: Joi.string().required(),
        MONGOOSE_PASSWORD: Joi.string().required(),
        MONGOOSE_DB: Joi.string().required(),
      }),
    }),
    ChatModule,
    ClientsModule.registerAsync(
      {
        clients: [
          {
            name: MICROSERVICE_NAME.USER_SERVICE,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.GRPC,
              options: {
                channelOptions: {
                  interceptors: [traceInterceptor('chat')],
                },
                url: configService.get<string>(
                  ENVIRONMENT_KEYS.GRPC_USER_SERVICE_URL,
                ),
                package: UserMicroService.protobufPackage,
                protoPath: join(process.cwd(), 'proto/user.proto'),
              },
            }),
          },
        ],
      },
      /*
      RabbitMQ
      {
          name: MICROSERVICE_NAME.USER_SERVICE,
          transport: Transport.RMQ,
          options: {
            urls: [
              // `amqp://rabbitmq:${configService.getOrThrow<number>(ENVIRONMENT_KEYS.USER_SERVICE_TCP_PORT)}`,
              `amqp://rabbitmq:5672`,
            ],
            queue: 'user_queue',
            queueOptions: {
              durable: false,
            },
          },
        },*/
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
