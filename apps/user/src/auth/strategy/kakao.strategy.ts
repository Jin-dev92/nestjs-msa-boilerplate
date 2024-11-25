import { Profile, Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super(
      {
        callbackURL: configService.getOrThrow('KAKAO_CALLBACK_URL'),
        clientID: configService.getOrThrow('KAKAO_CLIENT_ID'),
        clientSecret: configService.getOrThrow('KAKAO_CLIENT_SECRET'),
      },
      async (accessToken, refreshToken, profile: Profile, done) => {},
    );
  }
}
