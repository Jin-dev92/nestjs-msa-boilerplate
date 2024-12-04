import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '@libs/database';

export const Public = Reflector.createDecorator<UserRoleEnum>();
