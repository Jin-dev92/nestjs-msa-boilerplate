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
import { CreateUserDto, GetUserDto, GetUsersDto } from './dto';

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
    return await this.userService.getUserById(id);
  }

  @Get('find-one')
  async findOne(@Query() dto: GetUserDto) {
    return await this.userService.getUser(dto);
  }
  /*  Post Method */
  @Post()
  async signUp(@Body() dto: CreateUserDto) {
    return await this.userService.signUp(dto);
  }
}
