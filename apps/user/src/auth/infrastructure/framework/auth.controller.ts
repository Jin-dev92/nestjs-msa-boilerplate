import {Controller, UseInterceptors} from '@nestjs/common';
import {GrpcInterceptor, UserMicroService} from '@libs/common';
import {Metadata} from '@grpc/grpc-js';
import {HashPasswordUsecase, LoginUsecase, ParseBearerTokenUsecase, SignUpUsecase} from "../../usecase";
import {HashPasswordResponseMapper} from "../mapper";

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
      this.hashPasswordUsecase.execute(payload),
    ).toResponse();
  }

  async signUp(request: UserMicroService.SignUpRequest, metadata?: Metadata) {
    return await this.signUpUsecase.execute(request);
  }
}
