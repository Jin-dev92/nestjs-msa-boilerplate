import { UserMicroService } from '@libs/common';
import { CreateUserDto } from '../../../../usecase';

export class CreateUserRequestMapper {
  constructor(private readonly request: UserMicroService.CreateUserRequest) {}

  toDto(): CreateUserDto {
    const { email, password, username, role } = this.request;
    return {
      email,
      password,
      username,
    };
  }
}
