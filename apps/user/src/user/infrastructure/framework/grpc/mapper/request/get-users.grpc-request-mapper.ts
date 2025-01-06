import { UserMicroService } from '@libs/common';
import { GetUsersDto } from '../../../../../usecase';

export class GetUsersGrpcRequestMapper {
  constructor(private readonly dto: GetUsersDto) {}

  toGrpc(): UserMicroService.GetUsersRequest {
    const { role, username, email, skip, take } = this.dto;
    const payload: UserMicroService.GetUsersRequest = {};
    if (role) {
      payload.role = role;
    }
    if (username) {
      payload.username = username;
    }
    if (email) {
      payload.email = email;
    }
    if (skip) {
      payload.skip = skip;
    }
    if (take) {
      payload.take = take;
    }

    return payload;
  }
}
