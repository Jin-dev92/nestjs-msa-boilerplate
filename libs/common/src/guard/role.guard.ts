import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  MESSAGE_PATTERN_NAME,
  MICROSERVICE_NAME,
  Public,
  SuperUser,
} from '@libs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { User, UserRoleEnum } from '@libs/database';
import { GetUserDto } from '../../../../apps/user/src/user';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(MICROSERVICE_NAME.USER_SERVICE)
    private readonly userService: ClientProxy,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(Public, context.getClass());
    const isSuperUser =
      this.reflector.get(SuperUser, context.getClass()) === UserRoleEnum.SUPER;
    console.log(
      'this.reflector.get(SuperUser, context.getClass()): ',
      this.reflector.get(SuperUser, context.getClass()),
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new BadRequestException('로그인이 필요합니다.');
    }

    const user = await lastValueFrom(
      this.userService.send<User, GetUserDto>(
        MESSAGE_PATTERN_NAME.USER.GET_USER,
        {
          id: request.user.id,
          role: isSuperUser ? UserRoleEnum.SUPER : UserRoleEnum.USER,
        },
      ),
    );
    if (!user) {
      throw new BadRequestException('올바른 접근이 아닙니다.');
    }
    return true;
  }
}
