import { Profile, Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ENVIRONMENT_KEYS } from '@libs/common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(configService: ConfigService) {
    super({
      callbackURL: configService.getOrThrow(
        ENVIRONMENT_KEYS.KAKAO_REDIRECT_URI,
      ),
      clientID: configService.getOrThrow(ENVIRONMENT_KEYS.KAKAO_CLIENT_ID),
      clientSecret: configService.getOrThrow(
        ENVIRONMENT_KEYS.KAKAO_CLIENT_SECRET,
      ),
    });
  }
  validate(accessToken: string, refreshToken: string, profile: Profile) {}
}
