import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: +process.env['TCP_PORT'] || 3001,
      },
    },
  );
  /*  swagger 세팅 */
  // const swaggerConfig = new DocumentBuilder()
  //   .setTitle('nestjs-microservices-boilerplate')
  //   .setDescription('User Service API')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build();
  // const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  // SwaggerModule.setup('docs', app, swaggerDocument);
  /* swagger 세팅 끝 */
  await app.listen();
}

bootstrap();
