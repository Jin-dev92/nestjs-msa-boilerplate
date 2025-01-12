import {Inject, Injectable, NestMiddleware, OnModuleInit, UnauthorizedException,} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import {ClientGrpc} from '@nestjs/microservices';
import {dayjs, MICROSERVICE_NAME, UserMicroService} from '@libs/common';
import {lastValueFrom} from 'rxjs';
import {Cache, CACHE_MANAGER} from "@nestjs/cache-manager";

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware, OnModuleInit {
    authService: UserMicroService.AuthServiceClient;
    userService: UserMicroService.UserServiceClient;
    private readonly cacheKeyPrefix = 'user:';

    constructor(
        @Inject(MICROSERVICE_NAME.USER_SERVICE)
        private readonly userMicroService: ClientGrpc,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {
    }

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
            const payload = await lastValueFrom(
                this.authService.parseBearerToken({token: authorization}),
            );

            if (
                [
                    UserMicroService.TokenType.ACCESS,
                    UserMicroService.TokenType.REFRESH,
                ].includes(payload.type)
            ) {
                throw new UnauthorizedException('토큰의 타입이 올바르지 않습니다.');
            }
            const cachedPayload = await this.cacheManager.get([this.cacheKeyPrefix, payload.sub].join(''));
            if (cachedPayload) {
                req.user = cachedPayload;
                return next();
            }
            
            const user = await lastValueFrom(
                this.userService.getUser({id: payload.sub}),
            );

            if (!user) {
                throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
            }

            const expireDate = dayjs(payload.expireIn).unix();
            const now = dayjs().unix();
            const diff = expireDate - now;
            if (diff < 0) {
                throw new UnauthorizedException('토큰이 만료되었습니다.');
            }
            await this.cacheManager.set([this.cacheKeyPrefix, user.user.id].join(), user, diff);
            req.user = payload;
            next();
        } catch (e) {
            throw new UnauthorizedException('토큰이 올바르지 않습니다.');
        }
    }
}
