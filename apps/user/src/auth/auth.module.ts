import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EncryptionModule } from '@libs/encryption';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategy';

@Module({
  imports: [EncryptionModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
