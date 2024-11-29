import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ENVIRONMENT_KEYS } from '@libs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env[ENVIRONMENT_KEYS.HOST],
        port: +process.env[ENVIRONMENT_KEYS.TCP_PORT],
      },
    },
  );
  await app.listen();
}
bootstrap();
