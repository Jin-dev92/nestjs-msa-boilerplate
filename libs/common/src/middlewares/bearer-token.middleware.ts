import {
  Inject,
  Injectable,
  NestMiddleware,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { EncryptionService } from '@libs/encryption';
import { ClientGrpc } from '@nestjs/microservices';
import { MICROSERVICE_NAME, UserMicroService } from '@libs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware, OnModuleInit {
  authService: UserMicroService.AuthServiceClient;
  userService: UserMicroService.UserServiceClient;

  constructor(
    private readonly encryptionService: EncryptionService,
    @Inject(MICROSERVICE_NAME.USER_SERVICE)
    private readonly userMicroService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.userMicroService.getService<UserMicroService.AuthServiceClient>(
        UserMicroService.AUTH_SERVICE_NAME,
      );
    this.userService =
      this.userMicroService.getService<UserMicroService.UserServiceClient>(
        MICROSERVICE_NAME.USER_SERVICE,
      );
  }

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

      // this.userMicroService.
      const user = await lastValueFrom(
        this.userService.getUser({ id: payload.sub }),
      );

      if (!user) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
      }

      req.user = payload;
      next();
    } catch (e) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }
  }
}
