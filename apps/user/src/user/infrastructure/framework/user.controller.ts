import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcInterceptor, UserMicroService } from '@libs/common';

import { Metadata } from '@grpc/grpc-js';

import {
  CheckUserByEmailUsecase,
  CreateUserUsecase,
  GetUsersUsecase,
  GetUserUsecase,
} from '../../usecase';
import {
  CheckUserByEmailResponseMapper,
  CreateUserRequestMapper,
  CreateUserResponseMapper,
  GetUserRequestMapper,
  GetUserResponseMapper,
  GetUsersRequestMapper,
  GetUsersResponseMapper,
} from './mapper';

@UseInterceptors(GrpcInterceptor)
@UserMicroService.UserServiceControllerMethods()
@Controller()
export class UserController implements UserMicroService.UserServiceController {
  constructor(
    private readonly createUserUseCase: CreateUserUsecase,
    private readonly checkUserByEmailUseCase: CheckUserByEmailUsecase,
    private readonly getUserUseCase: GetUserUsecase,
    private readonly getUsersUseCase: GetUsersUsecase,
  ) {}

  /*
  @MessagePattern() // 응답을 해줘야 할 때 사용.
  @EventPattern() // 그냥 던져놓고 consume만 하면 될 때 사용.
*/

  /*
  Grpc 로 변경으로 인한 주석
  @MessagePattern({
    cmd: MESSAGE_PATTERN_NAME.USER.SIGN_UP,
  })*/
  async getUser(
    payload: UserMicroService.GetUserRequest,
  ): Promise<UserMicroService.GetUserResponse> {
    return new GetUserResponseMapper(
      await this.getUserUseCase.execute(
        new GetUserRequestMapper(payload).toDto(),
      ),
    ).toGrpc();
  }

  async getUsers(
    payload: UserMicroService.GetUsersRequest,
  ): Promise<UserMicroService.GetUsersResponse> {
    const { users, total } = await this.getUsersUseCase.execute(
      new GetUsersRequestMapper(payload).toDto(),
    );
    return new GetUsersResponseMapper(users, total).toGrpc();
  }

  async checkUserByEmail(
    payload: UserMicroService.CheckUserByEmailRequest,
  ): Promise<UserMicroService.CheckUserByEmailResponse> {
    return new CheckUserByEmailResponseMapper(
      await this.checkUserByEmailUseCase.execute(payload.email),
    ).toGrpc();
  }

  async createUser(
    request: UserMicroService.CreateUserRequest,
    metadata?: Metadata, // logging 용 metadata
  ): Promise<UserMicroService.CreateUserResponse> {
    return new CreateUserResponseMapper(
      await this.createUserUseCase.execute(
        new CreateUserRequestMapper(request).toDto(),
      ),
    ).toGrpc();
  }
}
