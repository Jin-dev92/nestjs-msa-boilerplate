import {
  dayjs,
  ENVIRONMENT_KEYS,
  GRPC_NAME,
  UseCase,
  UserMicroService,
} from '@libs/common';
import { IJwtPayload, ILoginResponse, LoginDto } from '@apps/user/auth';
import { JwtService } from '@nestjs/jwt';
import { UserDomain, UserOutputPort } from '@apps/user/user';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class LoginUsecase
  implements UseCase<LoginDto, Promise<ILoginResponse>>
{
  constructor(
    private readonly jwtService: JwtService,
    @Inject(GRPC_NAME.USER_GRPC)
    private readonly userOutputPort: UserOutputPort,
  ) {}

  async execute(dto: LoginDto): Promise<ILoginResponse> {
    const { email } = dto;
    // 유저 조회
    const user = await this.userOutputPort.checkUserByEmail(email);
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

  private async issueToken(
    user: UserDomain,
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
      type,
      role,
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
