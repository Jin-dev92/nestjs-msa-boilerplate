import {UserMicroService} from '@libs/common';
import {ISignUpResponse} from "../../../../../port";

export class SignUpGrpcResponseMapper {
  constructor(private readonly response: UserMicroService.SignUpResponse) {}

  toResponse(): ISignUpResponse {
    const { id, email, role, username } = this.response;
    return {
      id,
      email,
      username,
      role,
    };
  }
}
