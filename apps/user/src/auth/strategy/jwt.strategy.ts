import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
