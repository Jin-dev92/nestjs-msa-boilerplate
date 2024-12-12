import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ENVIRONMENT_KEYS, UserMicroService } from '@libs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  const configService = app.get('ConfigService');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: UserMicroService.protobufPackage,
      protoPath: join(process.cwd(), 'proto/chat.proto'),
      url: configService.getOrThrow(ENVIRONMENT_KEYS.GRPC_CHAT_SERVICE_URL),
    },
  });
  /*  모듈 내 글로벌 설정 */

  await app.startAllMicroservices();
}

bootstrap();
