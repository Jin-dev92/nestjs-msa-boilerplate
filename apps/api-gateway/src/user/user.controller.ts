import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, GetUsersDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  /*  Get Method */
  @Get()
  async findAll(@Query() dto: GetUsersDto) {
    return await this.userService.getUsers(dto);
  }

  @Get('find/:id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUser({ id });
  }
  @Get('check')
  async checkUserByEmail(@Param('email') email: string) {
    return await this.userService.checkUserByEmail(email);
  }
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }
}
