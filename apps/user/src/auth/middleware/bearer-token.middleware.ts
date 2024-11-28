import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { EncryptionService } from '@libs/encryption';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(private readonly encryptionService: EncryptionService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    try {
      if (!authorization) {
        throw new UnauthorizedException('토큰이 필요합니다.');
      }
      const payload =
        await this.encryptionService.parseBearerToken(authorization);

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
