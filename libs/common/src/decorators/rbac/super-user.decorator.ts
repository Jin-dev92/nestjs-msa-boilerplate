import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '@libs/database';

export const SuperUser = Reflector.createDecorator<UserRoleEnum>();
