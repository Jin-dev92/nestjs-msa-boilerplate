import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ENVIRONMENT_KEYS, UserMicroService } from '@libs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: UserMicroService.protobufPackage,
      protoPath: join(process.cwd(), UserMicroService.USER_PROTO_PATH),
      url: configService.getOrThrow(ENVIRONMENT_KEYS.GRPC_USER_SERVICE_URL),
    },

    /*
    *  RabbitMQ
    * transport: Transport.RMQ,
    options: {
      urls: [`amqp://rabbitmq:5672`],
      queue: 'user_queue',
      queueOptions: {
        durable: false,
      },
    },
    * */
    /* TCP
    transport: Transport.TCP,
    options: {
      port: parseInt(process.env['TCP_PORT']) || 3001,
      host: process.env[ENVIRONMENT_KEYS.HOST],
    },*/
  });
  await app.startAllMicroservices();
}

bootstrap();
