import { UserMicroService } from '@libs/common';
import { UserRoleEnum } from '@libs/database';

export interface IJwtPayload {
  sub: number; // id
  email: string;
  role: UserRoleEnum;
  type: UserMicroService.TokenType;
  exp: number;
}
