import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Joi } from '@libs/common';

@Module({
  imports: [
    JwtModule,
    // UserModule,
    ConfigModule.forRoot({
      envFilePath: './libs/encryption/.env',
      validationSchema: Joi.object({
        AUTH_ROUNDS: Joi.number().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
      }),
    }),
  ],
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class EncryptionModule {}
