import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { dayjs, ENVIRONMENT_KEYS, UserMicroService } from '@libs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '@libs/database';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUpExecutes(
    dto: UserMicroService.SignUpRequest,
  ): Promise<UserMicroService.SignUpResponse> {
    const { password } = dto;
    const response = await this.hashPasswordExecutes({
      password,
    });
    try {
      const user = await this.userService.createUser({
        ...dto,
        password: response.hash,
      });
      return { id: user.id };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async loginExecutes(dto: UserMicroService.LoginRequest) {
    const { email } = dto;
    // 유저 조회
    const user = await this.userService.checkUserByEmail(email);
    // 로그인 히스토리 남기기
    return {
      accessToken: await this.issueToken(
        user,
        UserMicroService.TokenType.ACCESS,
      ),
      refreshToken: await this.issueToken(
        user,
        UserMicroService.TokenType.REFRESH,
      ),
    };
  }

  async authenticateToLocalExecutes(email: string, password: string) {
    const user = await this.userService.checkUserByEmail(email);
    if (!(await this.comparePassword(password, user.password))) {
      throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');
    }
    return user;
  }

  // async authenticateToKakao(email: string, password: string) {}

  async reissueTokensExecutes(authorization: string) {
    // 토큰 검증 로직
    const { email, type, role, sub } = await this.parseBearerToken({
      token: authorization,
    });
    if (type !== UserMicroService.TokenType.REFRESH) {
      throw new BadRequestException('Refresh token이 아닙니다.');
    }
    // 토큰 재발급
    return {
      accessToken: await this.issueToken(
        { email, role, id: sub },
        UserMicroService.TokenType.ACCESS,
      ),
      refreshToken: await this.issueToken(
        { email, role, id: sub },
        UserMicroService.TokenType.REFRESH,
      ),
    };
  }

  async hashPasswordExecutes(payload: UserMicroService.HashPasswordRequest) {
    const { password } = payload;
    try {
      return {
        hash: await bcrypt.hash(
          password,
          parseInt(this.configService.getOrThrow(ENVIRONMENT_KEYS.AUTH_ROUNDS)),
        ),
      };
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('비밀번호 암호화에 실패했습니다.');
    }
  }

  async parseBearerToken(payload: UserMicroService.ParseBearerTokenRequest) {
    const { token: bearerToken, type } = payload;
    const [bearer, token] = bearerToken.split(' ');
    if (bearer.toLowerCase() !== 'bearer') {
      throw new BadRequestException('Bearer token 방식이 아닙니다.');
    }
    return await this.verifyTokenExecutes(token, type);
  }

  private comparePassword(password: string, hashedPassword: string) {
    try {
      return bcrypt.compare(password, hashedPassword);
    } catch (e) {
      throw e;
    }
  }

  private async verifyTokenExecutes(
    token: string,
    type?: UserMicroService.TokenType,
  ) {
    if (type === UserMicroService.TokenType.UNRECOGNIZED) {
      throw new UnauthorizedException('토큰이 손상되었습니다.');
    }
    try {
      const secret =
        type === UserMicroService.TokenType.ACCESS
          ? this.configService.getOrThrow(
              ENVIRONMENT_KEYS.JWT_ACCESS_TOKEN_SECRET,
            )
          : type === UserMicroService.TokenType.REFRESH
            ? this.configService.getOrThrow(
                ENVIRONMENT_KEYS.JWT_REFRESH_TOKEN_SECRET,
              )
            : null;

      if (type) {
        if (!secret) {
          throw new UnauthorizedException('시크릿키가 존재하지 않습니다.');
        }
        const payload = await this.jwtService.verifyAsync<IJwtPayload>(token, {
          secret,
        });
        return payload;
      } else {
        let payload = await this.jwtService.verifyAsync<IJwtPayload>(token, {
          secret: this.configService.getOrThrow(
            ENVIRONMENT_KEYS.JWT_ACCESS_TOKEN_SECRET,
          ),
        });
        if (payload.type !== UserMicroService.TokenType.ACCESS) {
          payload = await this.jwtService.verifyAsync<IJwtPayload>(token, {
            secret: this.configService.getOrThrow(
              ENVIRONMENT_KEYS.JWT_REFRESH_TOKEN_SECRET,
            ),
          });
          if (payload.type !== UserMicroService.TokenType.REFRESH) {
            throw new UnauthorizedException('토큰이 유효하지 않습니다.');
          }
        }
        return payload;
      }
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }
  }

  private async issueToken(
    user: Pick<User, 'id' | 'role' | 'email'>,
    type: UserMicroService.TokenType = UserMicroService.TokenType.ACCESS,
  ) {
    const secret =
      type === UserMicroService.TokenType.ACCESS
        ? ENVIRONMENT_KEYS.JWT_ACCESS_TOKEN_SECRET
        : ENVIRONMENT_KEYS.JWT_REFRESH_TOKEN_SECRET;
    const expiresIn = type === UserMicroService.TokenType.ACCESS ? '1h' : '14d';
    const { id, email, role } = user;
    const payload: IJwtPayload = {
      sub: id,
      email,
      role,
      type,
      exp:
        type === UserMicroService.TokenType.ACCESS
          ? dayjs().add(1, 'hour').unix()
          : dayjs().add(14, 'day').unix(),
    };
    return await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }
}
