import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @EventPattern({
  //   cmd: 'sign-up',
  // })
  @Post('/sign-up')
  async signUp(@Body() dto: CreateUserDto) {
    return await this.userService.signUp(dto);
  }

  // @MessagePattern() // 응답을 해줘야 할 때 사용.
  // @EventPattern() // 그냥 던져놓고 consume만 하면 될 때 사용.
}
