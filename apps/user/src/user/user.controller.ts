import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { EVENT_PATTERN_NAME, MESSAGE_PATTERN_NAME } from '@libs/common';
import { GetUserDto, GetUsersDto } from './dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
  @MessagePattern() // 응답을 해줘야 할 때 사용.
  @EventPattern() // 그냥 던져놓고 consume만 하면 될 때 사용.
*/

  @EventPattern({
    cmd: EVENT_PATTERN_NAME.USER.SIGN_UP,
  })
  async signUp(@Payload() payload: CreateUserDto) {
    return await this.userService.signUp(payload);
  }

  @MessagePattern(MESSAGE_PATTERN_NAME.USER.GET_USERS)
  async getUsers(@Payload() payload: GetUsersDto) {
    return await this.userService.getUsers(payload);
  }
  @MessagePattern(MESSAGE_PATTERN_NAME.USER.GET_USER)
  async getUser(@Payload() payload: GetUserDto) {
    return await this.userService.getUser(payload);
  }
}
