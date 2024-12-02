import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EncryptionService } from '@libs/encryption';
import { LoginDto } from './dto/login.dto';
import { MESSAGE_PATTERN_NAME } from '@libs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly encryptionService: EncryptionService,
  ) {}

  // @UsePipes(ValidationPipe)
  @MessagePattern({ cmd: MESSAGE_PATTERN_NAME.USER.LOGIN })
  async login(@Payload() payload: LoginDto) {
    return await this.authService.loginExecutes(payload);
  }

  // @UsePipes(ValidationPipe)
  @MessagePattern({ cmd: MESSAGE_PATTERN_NAME.USER.PARSE_BEARER_TOKEN })
  async parseBearerToken(@Payload() authorization: string) {
    return await this.encryptionService.parseBearerToken(authorization);
  }
}
