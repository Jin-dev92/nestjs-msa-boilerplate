import { UserMicroService } from '@libs/common';
import { UserDomain } from '../../../../../domain';

export class GetUserGrpcResponseMapper {
  constructor(private readonly response: UserMicroService.GetUserResponse) {}

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
