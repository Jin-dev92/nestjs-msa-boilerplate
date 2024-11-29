import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       host: process.env[ENVIRONMENT_KEYS.HOST],
  //       port: +process.env[ENVIRONMENT_KEYS.TCP_PORT],
  //     },
  //   },
  // );
  // await app.listen();
  const app = await NestFactory.create(AppModule, {});
  await app.listen(3003);
}
bootstrap();
