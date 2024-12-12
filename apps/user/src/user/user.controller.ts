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
  async signUp(payload: UserMicroService.SingUpRequest) {
    const user = await this.userService.signUp(payload);
    return { id: user.id };
  }

  async getUser(payload: UserMicroService.GetUserRequest) {
    const user = await this.userService.getUserById(payload);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
