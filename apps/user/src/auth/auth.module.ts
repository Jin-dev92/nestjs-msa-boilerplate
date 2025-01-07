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
import { GRPC_NAME } from '@libs/common';
import { UserRepository } from '@apps/user/user';

@Module({
  imports: [UserModule, JwtModule],
  controllers: [AuthController],
  providers: [
    LoginUsecase,
    HashPasswordUsecase,
    ParseBearerTokenUsecase,
    SignUpUsecase,
    {
      provide: GRPC_NAME.USER_GRPC,
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {}
