import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENVIRONMENT_KEYS, Joi, MICROSERVICE_NAME } from '@libs/common';
import { ChatModule } from './chat/chat.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>(ENVIRONMENT_KEYS.DATABASE_URL),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/chat/.env',
      validationSchema: Joi.object({
        CHAT_SERVICE_TCP_PORT: Joi.number().required(),
        CHAT_SERVICE_HOST: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        MONGOOSE_USER: Joi.string().required(),
        MONGOOSE_PASSWORD: Joi.string().required(),
        MONGOOSE_DB: Joi.string().required(),
      }),
    }),
    ChatModule,
    ClientsModule.register([
      {
        name: MICROSERVICE_NAME.USER_SERVICE,
        transport: Transport.TCP,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
