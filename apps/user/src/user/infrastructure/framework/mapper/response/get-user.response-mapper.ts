import { UserMicroService } from '@libs/common';
import { UserDomain } from '../../../../domain';

export class GetUserResponseMapper {
  constructor(private readonly user: UserDomain) {}

  toGrpc(): UserMicroService.GetUserResponse {
    const { username, role, email, password, id } = this.user;
    return {
      user: {
        id,
        email,
        username,
        password,
        role,
      },
    };
  }
}
