import { Controller, Headers, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // local 보안 로직은 직접 구현
  // @UseGuards(LocalGuard)
  @Post('login')
  async login(@Req() req) {
    return await this.authService.loginExecutes(req.user);
  }

  @UseGuards(KakaoGuard)
  @Post('login/kakao')
  async kakaoLogin() {
    // return this.authService.kakaoLogin();
  }

  @Post('/re-issue')
  async reissueTokens(@Headers('authorization') authorization: string) {
    return await this.authService.reissueTokensExecutes(authorization);
  }
}
