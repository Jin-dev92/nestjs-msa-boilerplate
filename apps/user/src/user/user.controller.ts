import { Controller, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcInterceptor, UserMicroService } from '@libs/common';

@UseInterceptors(GrpcInterceptor)
@UserMicroService.UserServiceControllerMethods()
@Controller()
export class UserController implements UserMicroService.UserServiceController {
  constructor(private readonly userService: UserService) {}

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
    return await this.userService.getUserByIdExecutes(payload);
  }

  async getUsers(
    payload: UserMicroService.GetUsersRequest,
  ): Promise<UserMicroService.GetUsersResponse> {
    return await this.userService.getUsersExecutes(payload);
  }

  async checkUserByEmail(
    payload: UserMicroService.CheckUserByEmailRequest,
  ): Promise<UserMicroService.CheckUserByEmailResponse> {
    return await this.userService.checkUserByEmailExecutes(payload);
  }
}
