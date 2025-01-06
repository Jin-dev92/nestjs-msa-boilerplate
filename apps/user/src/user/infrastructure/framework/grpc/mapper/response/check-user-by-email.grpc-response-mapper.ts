import { UserMicroService } from '@libs/common';
import { UserDomain } from '../../../../../domain';

export class CheckUserByEmailGrpcResponseMapper {
  constructor(
    private readonly response: UserMicroService.CheckUserByEmailResponse,
  ) {}

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
