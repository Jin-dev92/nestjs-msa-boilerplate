import { NestFactory } from '@nestjs/core';
import { ENVIRONMENT_KEYS } from '@libs/common';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const configService = app.get(ConfigService);
  /*  swagger 세팅 */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('nestjs-microservices-boilerplate')
    .setDescription('API gateway')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);
  /* swagger 세팅 끝 */

  await app.listen(
    parseInt(configService.get(ENVIRONMENT_KEYS.HTTP_PORT)) || 3000,
  );
}

bootstrap();
