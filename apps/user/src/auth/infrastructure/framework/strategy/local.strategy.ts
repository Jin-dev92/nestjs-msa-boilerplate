import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  // constructor(private readonly authService: AuthService) {
  //   super({ usernameField: 'email' });
  // }
  // async validate(email: string, password: string) {
  //   const user = await this.authService.authenticateToLocalExecutes(
  //     email,
  //     password,
  //   );
  //   return user;
  // }
}
