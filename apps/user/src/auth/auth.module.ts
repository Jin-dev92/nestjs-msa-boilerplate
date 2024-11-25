import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KakaoStrategy, LocalStrategy } from './strategy';
import { EncryptionModule } from '@libs/encryption';

@Module({
  imports: [EncryptionModule],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy, LocalStrategy],
})
export class AuthModule {}
