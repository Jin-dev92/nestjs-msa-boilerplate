import { UserMicroService } from '@libs/common';
import { CreateUserDto } from '../../../../../usecase';

export class CreateUserGrpcRequestMapper {
  constructor(private readonly user: CreateUserDto) {}

  toGrpc(): UserMicroService.CreateUserRequest {
    return {
      email: this.user.email,
      password: this.user.password,
      username: this.user.username,
    };
  }
}
