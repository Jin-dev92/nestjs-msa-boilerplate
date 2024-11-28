import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EncryptionService } from '@libs/encryption';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @MessagePattern({ cmd: 'parseBearerToken' })
  async parseBearerToken(@Payload() authorization: string) {
    return await this.encryptionService.parseBearerToken(authorization);
  }
  // local 보안 로직은 직접 구현
  // @UseGuards(LocalGuard)
  // @Post('login')
  // async login(@Body() dto: LoginDto) {
  //   return await this.authService.loginExecutes(dto);
  // }
  //
  // @UseGuards(KakaoGuard)
  // @Post('login/kakao')
  // async kakaoLogin() {
  //   // return this.authService.kakaoLogin();
  // }
  //
  // @UsePipes(ValidationPipe)
  // @Post('/re-issue')
  // async reissueTokens(@Headers('authorization') authorization: string) {
  //   return await this.authService.reissueTokensExecutes(authorization);

  // }
}
