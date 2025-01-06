import { UserDomain } from '../../../../../domain';
import { UserMicroService } from '@libs/common';

export class CreateUserGrpcRequestMapper {
  constructor(private readonly user: UserDomain) {}

  toGrpc(): UserMicroService.CreateUserRequest {
    return {
      email: this.user.email,
      password: this.user.password,
      username: this.user.username,
      role: this.user.role,
    };
  }
}
