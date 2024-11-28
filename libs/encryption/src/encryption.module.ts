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
      validationSchema: Joi.object({
        AUTH_ROUNDS: Joi.number().required(),
      }),
    }),
  ],
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class EncryptionModule {}
