import { ENVIRONMENT_KEYS, UseCase, UserMicroService } from '@libs/common';
import { IJwtPayload, ParseBearerTokenDto } from '@apps/user/auth';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ParseBearerTokenUsecase
  implements UseCase<ParseBearerTokenDto, Promise<IJwtPayload>>
{
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: ParseBearerTokenDto): Promise<IJwtPayload> {
    const { token: bearerToken, type } = dto;
    const [bearer, token] = bearerToken.split(' ');
    if (bearer.toLowerCase() !== 'bearer') {
      throw new BadRequestException('Bearer token 방식이 아닙니다.');
    }
    return await this.verifyTokenExecutes(token, type);
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
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }
  }
}
