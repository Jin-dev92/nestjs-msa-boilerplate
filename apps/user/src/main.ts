import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import process from 'node:process';
import { ENVIRONMENT_KEYS } from '@libs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: +process.env['TCP_PORT'] || 3001,
        host: process.env[ENVIRONMENT_KEYS.HOST],
      },
    },
  );
  await app.listen();
}

bootstrap();
