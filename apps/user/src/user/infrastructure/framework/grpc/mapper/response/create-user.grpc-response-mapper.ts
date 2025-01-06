import { UserMicroService } from '@libs/common';
import { UserDomain } from '../../../../../domain';

export class CreateUserGrpcResponseMapper {
  constructor(private readonly response: UserMicroService.CreateUserResponse) {}

  toDomain(): UserDomain {
    const {
      user: { email, username, role, password },
    } = this.response;
    return new UserDomain({
      email,
      password,
      username,
      role,
    });
  }
}
