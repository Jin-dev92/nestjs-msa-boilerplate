import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENVIRONMENT_KEYS } from '@libs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  /*  swagger 세팅 */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('nestjs-microservices-boilerplate')
    .setDescription('User Service API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);
  /* swagger 세팅 끝 */
  await app.listen(process.env[ENVIRONMENT_KEYS.HTTP_PORT] ?? 3001);
}
bootstrap();
