import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Public, SuperUser, UserMicroService } from '@libs/common';
import { Reflector } from '@nestjs/core';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class RoleGuard implements CanActivate, OnModuleInit {
  userService: UserMicroService.UserServiceClient;
  constructor(
    private readonly reflector: Reflector,
    @Inject(UserMicroService.USER_SERVICE_NAME)
    private readonly userMicroService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.userMicroService.getService<UserMicroService.UserServiceClient>(
        UserMicroService.USER_SERVICE_NAME,
      );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(Public, context.getClass());
    const isSuperUser =
      this.reflector.get(SuperUser, context.getClass()) ===
      UserMicroService.UserRoleEnum.SUPER;
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new BadRequestException('로그인이 필요합니다.');
    }

    const { user } = await lastValueFrom(
      this.userService.getUser({
        id: request.user.id,
        role: isSuperUser
          ? UserMicroService.UserRoleEnum.SUPER
          : UserMicroService.UserRoleEnum.USER,
      }),
    );
    if (!user) {
      throw new BadRequestException('올바른 접근이 아닙니다.');
    }
    return true;
  }
}
