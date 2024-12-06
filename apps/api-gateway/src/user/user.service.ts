import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, GetUserDto, GetUsersDto } from './dto';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERN_NAME, MICROSERVICE_NAME } from '@libs/common';
import { lastValueFrom } from 'rxjs';
import { User } from '@libs/database';

@Injectable()
export class UserService {
  constructor(
    @Inject(MICROSERVICE_NAME.USER_SERVICE)
    private readonly userMicroService: ClientProxy,
  ) {}

  async signUp(dto: CreateUserDto) {
    try {
      return await lastValueFrom(
        this.userMicroService.send<User, CreateUserDto>(
          { cmd: MESSAGE_PATTERN_NAME.USER.SIGN_UP },
          dto,
        ),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getUsers(dto: GetUsersDto) {
    try {
      return await lastValueFrom(
        this.userMicroService.send<User[], GetUsersDto>(
          { cmd: MESSAGE_PATTERN_NAME.USER.GET_USERS },
          dto,
        ),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getUser(dto: GetUserDto) {
    try {
      return await lastValueFrom(
        this.userMicroService.send<User, GetUserDto>(
          { cmd: MESSAGE_PATTERN_NAME.USER.GET_USER },
          dto,
        ),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  async getUserById(id: number) {
    try {
      return await lastValueFrom(
        this.userMicroService.send<User, Pick<GetUserDto, 'id'>>(
          { cmd: MESSAGE_PATTERN_NAME.USER.GET_USER },
          { id },
        ),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
