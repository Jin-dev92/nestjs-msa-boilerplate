import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserMicroService } from '@libs/common';
import { lastValueFrom } from 'rxjs';
import { GetUserDto, GetUsersDto } from './dto';

@Injectable()
export class UserService {
  private readonly userService: UserMicroService.UserServiceClient;
  constructor(
    @Inject(UserMicroService.USER_SERVICE_NAME)
    private readonly userMicroService: ClientGrpc,
  ) {
    this.userService =
      this.userMicroService.getService<UserMicroService.UserServiceClient>(
        UserMicroService.USER_SERVICE_NAME,
      );
  }

  async getUsers(dto: GetUsersDto) {
    try {
      return await lastValueFrom(this.userService.getUsers(dto));
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getUser(dto: GetUserDto) {
    const { id } = dto;
    try {
      return await lastValueFrom(this.userService.getUser({ id }));
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async checkUserByEmail(email: string) {
    try {
      return await lastValueFrom(this.userService.checkUserByEmail({ email }));
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
