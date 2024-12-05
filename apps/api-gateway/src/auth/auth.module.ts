import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EncryptionModule } from '@libs/encryption';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ENVIRONMENT_KEYS, MICROSERVICE_NAME } from '@libs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    EncryptionModule,
    ClientsModule.registerAsync([
      {
        name: MICROSERVICE_NAME.USER_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get(ENVIRONMENT_KEYS.USER_SERVICE_HOST),
            port: parseInt(
              configService.get(ENVIRONMENT_KEYS.USER_SERVICE_TCP_PORT),
            ),
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
