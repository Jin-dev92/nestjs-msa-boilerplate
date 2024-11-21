import { Profile, Strategy } from 'passport-kakao';

export class KakaoStrategy extends Strategy {
  constructor() {
    super(
      { callbackURL: '', clientID: '', clientSecret: '' },
      async (accessToken, refreshToken, profile: Profile, done) => {},
    );
  }
}
