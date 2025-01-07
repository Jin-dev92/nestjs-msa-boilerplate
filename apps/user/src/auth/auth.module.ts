import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@apps/user/auth/infrastructure';
import {
  HashPasswordUsecase,
  LoginUsecase,
  ParseBearerTokenUsecase,
  SignUpUsecase,
} from '@apps/user/auth/usecase';

@Module({
  imports: [UserModule, JwtModule],
  controllers: [AuthController],
  providers: [
    LoginUsecase,
    HashPasswordUsecase,
    ParseBearerTokenUsecase,
    SignUpUsecase,
  ],
})
export class AuthModule {}
