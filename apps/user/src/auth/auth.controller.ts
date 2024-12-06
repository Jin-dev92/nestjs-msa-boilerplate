import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EncryptionService } from '@libs/encryption';
import { LoginDto } from './dto/login.dto';
import { MESSAGE_PATTERN_NAME } from '@libs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @MessagePattern({ cmd: MESSAGE_PATTERN_NAME.USER.LOGIN })
  async login(@Payload() payload: LoginDto) {
    return await this.authService.loginExecutes(payload);
  }
}
