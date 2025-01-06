import { UserMicroService } from '@libs/common';
import { SignUpDto } from '@apps/user/auth';

export class SignUpGrpcRequestMapper {
  constructor(private readonly dto: SignUpDto) {}
  toGrpc(): UserMicroService.SignUpRequest {
    const { email, password, username } = this.dto;
    return {
      email,
      password,
      username,
    };
  }
}
