import { UserMicroService } from '@libs/common';
import { UserDomain } from '../../../../domain';

export class CreateUserResponseMapper {
  constructor(private readonly user: UserDomain) {}

  toGrpc(): UserMicroService.CreateUserResponse {
    return { user: this.user };
  }
}
