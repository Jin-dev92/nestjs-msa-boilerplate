import { NestFactory } from '@nestjs/core';
import { UploadModule } from './upload.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(UploadModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'upload',
      protoPath: join(process.cwd(), 'proto/upload.proto'),
    },
  });
  await app.startAllMicroservices();
}

bootstrap();
