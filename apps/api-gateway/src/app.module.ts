import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Joi } from '@libs/common';
import { ApiGatewayModule } from './api-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api-gateway/.env',
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
      }),
    }),
    ApiGatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
