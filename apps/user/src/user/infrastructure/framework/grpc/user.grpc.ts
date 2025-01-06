import { UserMicroService } from '@libs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Inject, OnModuleInit } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { IGetUsersResponse, UserOutputPort } from '../../../port';
import { CreateUserDto, GetUserDto, GetUsersDto } from '../../../usecase';
import { UserDomain } from '../../../domain';
import {
  CheckUserByEmailGrpcResponseMapper,
  CreateUserGrpcRequestMapper,
  CreateUserGrpcResponseMapper,
  GetUserGrpcRequestMapper,
  GetUserGrpcResponseMapper,
  GetUsersGrpcRequestMapper,
  GetUsersGrpcResponseMapper,
} from './mapper';

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

  async createUser(dto: CreateUserDto) {
    const response = await lastValueFrom(
      this.userService.createUser(
        new CreateUserGrpcRequestMapper(dto).toGrpc(),
      ),
    );
    return new CreateUserGrpcResponseMapper(response).toDomain();
  }

  async checkUserByEmail(email: string) {
    const response = await lastValueFrom(
      this.userService.checkUserByEmail({ email }),
    );
    return new CheckUserByEmailGrpcResponseMapper(response).toDomain();
  }

  async getUser(dto: GetUserDto): Promise<UserDomain> {
    const response = await lastValueFrom(
      this.userService.getUser(new GetUserGrpcRequestMapper(dto).toGrpc()),
    );
    return new GetUserGrpcResponseMapper(response).toDomain();
  }

  async getUsers(dto: GetUsersDto): Promise<IGetUsersResponse> {
    const response = await lastValueFrom(
      this.userService.getUsers(new GetUsersGrpcRequestMapper(dto).toGrpc()),
    );
    return new GetUsersGrpcResponseMapper(response).toDomain();
  }
}
