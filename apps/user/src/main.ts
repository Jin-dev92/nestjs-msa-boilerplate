import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://rabbitmq:5672`],
      queue: 'user_queue',
      queueOptions: {
        durable: false,
      },
    },
    // transport: Transport.TCP,
    // options: {
    //   port: parseInt(process.env['TCP_PORT']) || 3001,
    //   host: process.env[ENVIRONMENT_KEYS.HOST],
    // },
  });
  await app.startAllMicroservices();
}

bootstrap();
