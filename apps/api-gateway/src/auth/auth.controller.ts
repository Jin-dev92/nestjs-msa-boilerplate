import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserMicroService } from '@libs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.requestLoginExecutes(dto);
  }
  @Post('sign-up')
  async signUp(@Body() dto: UserMicroService.SignUpRequest) {
    return await this.authService.requestLoginExecutes(dto);
  }
}
