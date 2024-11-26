import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { ConfigModule } from '@nestjs/config';
import Joi from '@libs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../../apps/user/src/user/user.module';

@Module({
  imports: [
    JwtModule,
    UserModule,
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
