import {UserMicroService} from '@libs/common';

export interface IJwtPayload {
  sub: number; // id
  email: string;
  role: UserMicroService.UserRoleEnum;
  type: UserMicroService.TokenType;
  expireIn: number;
}
