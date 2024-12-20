import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserMicroService } from '@libs/common';

@UserMicroService.AuthServiceControllerMethods()
@Controller()
export class AuthController implements UserMicroService.AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  /*@MessagePattern({ cmd: MESSAGE_PATTERN_NAME.USER.LOGIN })*/
  async login(payload: UserMicroService.LoginRequest) {
    const tokens = await this.authService.loginExecutes(payload);
    return tokens;
  }

  async parseBearerToken(payload: UserMicroService.ParseBearerTokenRequest) {
    return await this.authService.parseBearerToken(payload);
  }

  async hashPassword(payload: UserMicroService.HashPasswordRequest) {
    return await this.authService.hashPasswordExecutes(payload);
  }
}
