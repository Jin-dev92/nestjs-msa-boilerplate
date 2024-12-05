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
        host: process.env[ENVIRONMENT_KEYS.CHAT_SERVICE_HOST],
        port: +process.env[ENVIRONMENT_KEYS.CHAT_SERVICE_TCP_PORT],
      },
    },
  );
  await app.listen();
  // const app = await NestFactory.create(AppModule, {});
  // await app.listen(3002);
}

bootstrap();
