import { UserRoleEnum } from '@libs/database';

export interface IJwtPayload {
  sub: number; // id
  email: string;
  role: UserRoleEnum;
  type: 'access' | 'refresh';
}
