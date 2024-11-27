import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EventPattern } from '@nestjs/microservices';
import { User } from '@libs/database';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // local 보안 로직은 직접 구현
  // @UseGuards(LocalGuard)
  // @Post('login')
  // async login(@Req() req) {
  //   return await this.authService.loginExecutes(req.user);
  // }
  //
  // @UseGuards(KakaoGuard)
  // @Post('login/kakao')
  // async kakaoLogin() {
  //   // return this.authService.kakaoLogin();
  // }
  //
  // @Post('/re-issue')
  // async reissueTokens(@Headers('authorization') authorization: string) {
  //   return await this.authService.reissueTokensExecutes(authorization);
  // }
  // @MessagePattern({cmd: 'login'})
  @EventPattern('login')
  async login(user: User) {
    return await this.authService.loginExecutes(user);
  }
}
