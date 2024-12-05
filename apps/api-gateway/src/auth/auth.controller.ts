import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EncryptionService } from '@libs/encryption';
import { Payload } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @Post('login')
  async login(@Payload() payload: LoginDto) {
    return await this.authService.requestLoginExecutes(payload);
  }
}
