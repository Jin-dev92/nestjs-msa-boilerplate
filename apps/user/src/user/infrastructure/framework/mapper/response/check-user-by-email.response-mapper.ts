import { UserMicroService } from '@libs/common';
import { UserDomain } from '../../../../domain';

export class CheckUserByEmailResponseMapper {
  constructor(private readonly user: UserDomain) {}

  toGrpc(): UserMicroService.CheckUserByEmailResponse {
    const { id, email, role, password, username } = this.user;
    return {
      user: { id, email, role, password, username },
    };
  }
}
