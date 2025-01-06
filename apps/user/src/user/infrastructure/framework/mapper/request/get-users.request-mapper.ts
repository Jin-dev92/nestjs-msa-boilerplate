import { UserMicroService } from '@libs/common';
import { GetUsersDto } from '@apps/user/user';

export class GetUsersRequestMapper {
  constructor(private readonly request: UserMicroService.GetUsersRequest) {}

  toDto(): GetUsersDto {
    const dto: GetUsersDto = {};
    const { skip, role, username, take, email } = this.request;
    if (skip) {
      dto.skip = skip;
    }
    if (role) {
      dto.role = role;
    }
    if (username) {
      dto.username = username;
    }
    if (take) {
      dto.take = take;
    }
    if (email) {
      dto.email = email;
    }
    return dto;
  }
}
