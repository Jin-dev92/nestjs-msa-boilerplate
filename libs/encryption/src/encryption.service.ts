import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@libs/database';
import { IJwtPayload } from '@libs/encryption/interfaces';
import { UserService } from '../../../apps/user/src/user/user.service';
import { ENVIRONMENT_KEYS } from '@libs/common';

@Injectable()
export class EncryptionService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async hashPassword(password: string, salt = undefined) {
    return await bcrypt.hash(
      password,
      salt || this.configService.getOrThrow(ENVIRONMENT_KEYS.AUTH_ROUNDS),
    );
  }

  async issueToken(
    user: Pick<User, 'id' | 'role' | 'email'>,
    type: 'access' | 'refresh' = 'access',
  ) {
    const secret =
      type === 'access'
        ? ENVIRONMENT_KEYS.JWT_ACCESS_TOKEN_SECRET
        : ENVIRONMENT_KEYS.JWT_REFRESH_TOKEN_SECRET;
    const expiresIn = type === 'access' ? '1h' : '14d';
    const { id, email, role } = user;
    const payload: IJwtPayload = {
      sub: id,
      email,
      role,
      type,
    };
    return await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }
  verifyToken(token: string, type: 'access' | 'refresh' = 'access') {
    const secret =
      type === 'access'
        ? ENVIRONMENT_KEYS.JWT_ACCESS_TOKEN_SECRET
        : ENVIRONMENT_KEYS.JWT_REFRESH_TOKEN_SECRET;
    return this.jwtService.verifyAsync<IJwtPayload>(token, {
      secret,
    });
  }

  async parseBearerToken(bearerToken: string) {
    const [bearer, token] = bearerToken.split(' ');
    if (bearer.toLowerCase() !== 'bearer') {
      throw new BadRequestException('Bearer token 방식이 아닙니다.');
    }
    return await this.verifyToken(token);
  }
}
