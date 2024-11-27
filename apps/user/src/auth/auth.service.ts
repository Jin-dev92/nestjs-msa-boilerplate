import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EncryptionService } from '@libs/encryption';
import { User } from '@libs/database';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    // private readonly client: ClientProxy,
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async loginExecutes(user: User) {
    return {
      accessToken: await this.encryptionService.issueToken(user, 'access'),
      refreshToken: await this.encryptionService.issueToken(user, 'refresh'),
    };
  }

  async authenticateToLocalExecutes(email: string, password: string) {
    const user = await this.userService.checkUserByEmail(email);
    if (
      user.password !== (await this.encryptionService.hashPassword(password))
    ) {
      throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');
    }
    return user;
  }

  // async authenticateToKakao(email: string, password: string) {}

  async reissueTokensExecutes(authorization: string) {
    // 토큰 검증 로직
    const { email, type, role, sub } =
      await this.encryptionService.parseBearerToken(authorization);
    if (type !== 'refresh') {
      throw new BadRequestException('Refresh token이 아닙니다.');
    }
    // 토큰 재발급
    return {
      accessToken: await this.encryptionService.issueToken(
        { email, role, id: sub },
        'access',
      ),
      refreshToken: await this.encryptionService.issueToken(
        { email, role, id: sub },
        'refresh',
      ),
    };
  }
}
