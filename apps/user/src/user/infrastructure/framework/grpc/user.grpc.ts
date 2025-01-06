import { UserMicroService } from '@libs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Inject, OnModuleInit } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { IGetUsersResponse, UserOutputPort } from '../../../port';
import { GetUserDto, GetUsersDto } from '../../../usecase';
import { UserDomain } from '../../../domain';

export class UserGrpc implements UserOutputPort, OnModuleInit {
  private userService: UserMicroService.UserServiceClient;

  constructor(
    @Inject(UserMicroService.USER_SERVICE_NAME)
    private readonly userMicroService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.userMicroService.getService<UserMicroService.UserServiceClient>(
        UserMicroService.USER_SERVICE_NAME,
      );
  }

  async createUser(user: UserDomain) {
    const response = await lastValueFrom();
    return undefined;
  }

  async checkUserByEmail(email: string) {
    const response = await lastValueFrom(
      this.userService.checkUserByEmail({ email }),
    );
    const { user } = response;
    return undefined;
  }

  async getUser(dto: GetUserDto): Promise<UserDomain> {
    const response = await lastValueFrom();
    return undefined;
  }

  async getUsers(dto: GetUsersDto): Promise<IGetUsersResponse> {
    const response = await lastValueFrom(this.userService.getUsers(dto));
    const { users, total } = response;
    return {
      users: users.map((user) => new UserDomain(user)),
      total,
    };
  }
}
