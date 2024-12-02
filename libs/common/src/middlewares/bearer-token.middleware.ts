import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MESSAGE_PATTERN_NAME, MICROSERVICE_NAME } from '@libs/common/const';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { IJwtPayload } from '@libs/encryption';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(
    @Inject(MICROSERVICE_NAME.USER_SERVICE)
    private readonly userService: ClientProxy,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    try {
      if (!authorization) {
        throw new UnauthorizedException('토큰이 필요합니다.');
      }

      const payload = await lastValueFrom<IJwtPayload>(
        this.userService.send(
          MESSAGE_PATTERN_NAME.USER.PARSE_BEARER_TOKEN,
          authorization,
        ),
      );

      if (['access', 'refresh'].includes(payload.type)) {
        throw new UnauthorizedException('토큰의 타입이 올바르지 않습니다.');
      }
      req.user = payload;
      next();
    } catch (e) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }
  }
}
