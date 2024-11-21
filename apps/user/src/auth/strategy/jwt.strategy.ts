import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

export class JwtStrategy extends Strategy {
  constructor() {
    super(
      {
        ignoreExpiration: undefined,
        jwtFromRequest: ExtractJwt.fromHeader('authorization'),
        secretOrKey: undefined,
      },
      (payload: any, done: VerifiedCallback) => {},
    );
  }
}
