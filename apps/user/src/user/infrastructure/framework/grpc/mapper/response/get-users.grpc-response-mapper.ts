import { UserMicroService } from '@libs/common';
import { UserDomain } from '../../../../../domain';
import { IGetUsersResponse } from '../../../../../port';

export class GetUsersGrpcResponseMapper {
  constructor(private readonly response: UserMicroService.GetUsersResponse) {}

  toDomain(): IGetUsersResponse {
    const { users, total } = this.response;
    return {
      users: users.map((user) => new UserDomain(user)),
      total,
    };
  }
}
