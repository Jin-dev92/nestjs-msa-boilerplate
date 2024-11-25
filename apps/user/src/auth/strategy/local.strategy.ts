import { Strategy } from 'passport-local';

export class LocalStrategy extends Strategy {
  constructor() {
    super({ usernameField: 'email' }, (email, password, done) => ({
      // done(null, user);
    }));
  }
}
