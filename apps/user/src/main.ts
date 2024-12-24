import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  ENVIRONMENT_KEYS,
  GrpcInterceptor,
  UserMicroService,
} from '@libs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  /* globals */
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new GrpcInterceptor());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: UserMicroService.protobufPackage,
      protoPath: join(process.cwd(), 'proto/user.proto'),
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
