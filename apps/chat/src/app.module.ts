import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Joi, MICROSERVICE_NAME } from '@libs/common';
import { ChatModule } from './chat/chat.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     url: configService.getOrThrow(ENVIRONMENT_KEYS.DATABASE_URL),
    //     synchronize: true,
    //     autoLoadEntities: true,
    //   }),
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/chat/.env',
      validationSchema: Joi.object({
        TCP_PORT: Joi.number().required(),
        DATABASE_URL: Joi.string().required(),
        HOST: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
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
