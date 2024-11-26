import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { EncryptionService } from '@libs/encryption';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(private readonly encryptionService: EncryptionService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new BadRequestException('토큰이 필요합니다.');
    }
    const {} = this.encryptionService.parseBearerToken(authorization);
    next();
  }
}
