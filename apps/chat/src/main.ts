import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.connectMicroservice<MicroserviceOptions>({});
  await app.startAllMicroservices();

  /*
  RabbitMQ
  * transport: Transport.RMQ,
    options: {
      urls: [`amqp://rabbitmq:5672`],
      queue: 'chat_queue',
      queueOptions: {
        durable: false,
      },
    },
  *
  * */
}

bootstrap();
