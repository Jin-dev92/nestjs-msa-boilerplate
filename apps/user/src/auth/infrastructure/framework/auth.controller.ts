import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcInterceptor, UserMicroService } from '@libs/common';
import { Metadata } from '@grpc/grpc-js';
import {
  HashPasswordResponseMapper,
  HashPasswordUsecase,
  LoginUsecase,
  ParseBearerTokenUsecase,
} from '@apps/user/auth';
import { SignUpUsecase } from '@apps/user/auth/usecase/sign-up.usecase';

@UseInterceptors(GrpcInterceptor)
@UserMicroService.AuthServiceControllerMethods()
@Controller()
export class AuthController implements UserMicroService.AuthServiceController {
  constructor(
    private readonly parseBearerTokenUsecase: ParseBearerTokenUsecase,
    private readonly loginUsecase: LoginUsecase,
    private readonly hashPasswordUsecase: HashPasswordUsecase,
    private readonly signUpUsecase: SignUpUsecase,
  ) {}

  /*@MessagePattern({ cmd: MESSAGE_PATTERN_NAME.USER.LOGIN })*/
  async login(payload: UserMicroService.LoginRequest, metadata?: Metadata) {
    return this.loginUsecase.execute(payload);
  }

  async parseBearerToken(
    payload: UserMicroService.ParseBearerTokenRequest,
    metadata?: Metadata,
  ) {
    return await this.parseBearerTokenUsecase.execute(payload);
  }

  async hashPassword(
    payload: UserMicroService.HashPasswordRequest,
    metadata?: Metadata,
  ) {
    return new HashPasswordResponseMapper(
      await this.hashPasswordUsecase.execute(payload),
    ).toResponse();
  }

  async signUp(request: UserMicroService.SignUpRequest, metadata?: Metadata) {
    return await this.signUpUsecase.execute(request);
  }
}
