import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ENVIRONMENT_KEYS, Joi, MICROSERVICE_NAME } from '@libs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        TCP_PORT: Joi.number().required(),
        HOST: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          inject: [ConfigService],
          name: MICROSERVICE_NAME.USER_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.getOrThrow(ENVIRONMENT_KEYS.HOST),
              port: configService.getOrThrow(ENVIRONMENT_KEYS.TCP_PORT),
            },
          }),
        },
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
