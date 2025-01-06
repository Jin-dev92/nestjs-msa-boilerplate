import { UserMicroService } from '@libs/common';
import { GetUserDto } from '../../../../usecase';

export class GetUserRequestMapper {
  constructor(private readonly request: UserMicroService.GetUserRequest) {}

  toDto(): GetUserDto {
    const dto: GetUserDto = {};
    const { id, role } = this.request;
    if (id) {
      dto.id = id;
    }
    if (role) {
      dto.role = role;
    }
    return dto;
  }
}
