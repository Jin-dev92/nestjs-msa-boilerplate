import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { EVENT_PATTERN_NAME, MESSAGE_PATTERN_NAME } from '@libs/common';

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
  @Post('/sign-up')
  async signUp(@Body() dto: CreateUserDto) {
    return await this.userService.signUp(dto);
  }

  @MessagePattern(MESSAGE_PATTERN_NAME.USER.LOGIN)
  async getUsers() {
    return await this.userService.getUsers();
  }
}
