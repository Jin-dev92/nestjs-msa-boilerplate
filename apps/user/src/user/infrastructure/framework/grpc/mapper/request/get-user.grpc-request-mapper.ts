import { UserMicroService } from '@libs/common';
import { GetUserDto } from '../../../../../usecase';

export class GetUserGrpcRequestMapper {
  constructor(private readonly dto: GetUserDto) {}

  toGrpc(): UserMicroService.GetUserRequest {
    const { id, role } = this.dto;
    const payload: UserMicroService.GetUserRequest = { id };
    if (role) {
      payload.role = role;
    }
    return payload;
  }
}
