import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { EncryptionService } from '@libs/encryption';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async authenticateToLocal(email: string, password: string) {
    const user = await this.userService.checkUserByEmail(email);
    if (
      user.password !== (await this.encryptionService.hashPassword(password))
    ) {
      throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');
    }
    return user;
  }
  // async authenticateToJwt(email: string, password: string) {}
  // async authenticateToKakao(email: string, password: string) {}
}
