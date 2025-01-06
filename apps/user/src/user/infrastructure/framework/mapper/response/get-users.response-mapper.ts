import { UserMicroService } from '@libs/common';
import { UserDomain } from '../../../../domain';

export class GetUsersResponseMapper {
  constructor(
    private readonly users: UserDomain[],
    private readonly total: number,
  ) {}

  toGrpc(): UserMicroService.GetUsersResponse {
    return {
      users: this.users.map((user) => ({
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.password,
        role: user.role,
      })),
      total: this.total,
    };
  }
}
