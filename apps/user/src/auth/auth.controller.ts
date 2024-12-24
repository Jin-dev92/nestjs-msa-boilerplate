import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserMicroService } from '@libs/common';
import { Metadata } from '@grpc/grpc-js';

@UserMicroService.AuthServiceControllerMethods()
@Controller()
export class AuthController implements UserMicroService.AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  /*@MessagePattern({ cmd: MESSAGE_PATTERN_NAME.USER.LOGIN })*/
  async login(payload: UserMicroService.LoginRequest, metadata?: Metadata) {
    const tokens = await this.authService.loginExecutes(payload);
    return tokens;
  }

  async parseBearerToken(payload: UserMicroService.ParseBearerTokenRequest) {
    return await this.authService.parseBearerToken(payload);
  }

  async hashPassword(payload: UserMicroService.HashPasswordRequest) {
    return await this.authService.hashPasswordExecutes(payload);
  }

  async signUp(request: UserMicroService.SignUpRequest, metadata?: Metadata) {
    return await this.authService.signUpExecutes(request);
  }
}
