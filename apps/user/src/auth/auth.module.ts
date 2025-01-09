import {Module} from '@nestjs/common';
import {UserModule} from '../user/user.module';
import {JwtModule} from '@nestjs/jwt';
import {GRPC_NAME} from '@libs/common';
import {AuthController} from "./infrastructure";
import {HashPasswordUsecase, LoginUsecase, ParseBearerTokenUsecase, SignUpUsecase} from "./usecase";
import {UserRepository} from "../user";

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
