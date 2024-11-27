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

  @Post('/sign-up')
  async signUp(@Body() dto: CreateUserDto) {
    return await this.userService.signUp(dto);
  }
}
