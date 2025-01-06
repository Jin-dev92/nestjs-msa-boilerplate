import { UserMicroService } from '@libs/common';
import {
  HashPasswordDto,
  IJwtPayload,
  ILoginResponse,
  LoginDto,
  ParseBearerTokenDto,
  SignUpDto,
} from '../usecase';

export interface ISignUpResponse {
  id: number;
  email: string;
  username: string;
  role: UserMicroService.UserRoleEnum;
}

export interface AuthOutputPort {
  login(dto: LoginDto): Promise<ILoginResponse>;
  parseBearerToken(dto: ParseBearerTokenDto): Promise<IJwtPayload>;
  hashPassword(dto: HashPasswordDto): Promise<string>;
  signUp(dto: SignUpDto): Promise<ISignUpResponse>;
}
