import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EncryptionService } from '@libs/encryption';
import { UserMicroService } from '@libs/common';

@UserMicroService.AuthServiceControllerMethods()
@Controller()
export class AuthController implements UserMicroService.AuthServiceController {
  constructor(
    private readonly authService: AuthService,
    private readonly encryptionService: EncryptionService,
  ) {}

  /*@MessagePattern({ cmd: MESSAGE_PATTERN_NAME.USER.LOGIN })*/
  async login(payload: UserMicroService.LoginRequest) {
    const tokens = await this.authService.loginExecutes(payload);
    return tokens;
  }

  parseBearerToken(request: UserMicroService.ParseBearerTokenRequest) {
    return undefined;
  }
}
