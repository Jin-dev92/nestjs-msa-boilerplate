import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ENVIRONMENT_KEYS } from '@libs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: parseInt(process.env['TCP_PORT']) || 3001,
      host: process.env[ENVIRONMENT_KEYS.HOST],
    },
  });
  await app.startAllMicroservices();
}

bootstrap();
