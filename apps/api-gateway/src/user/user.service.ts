import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GRPC_NAME } from '@libs/common';
import { CreateUserDto, GetUserDto, GetUsersDto } from './dto';
import { UserGrpc } from '../../../user/src/user';

@Injectable()
export class UserService {
  constructor(
    @Inject(GRPC_NAME.USER_GRPC)
    private readonly userGrpc: UserGrpc,
  ) {}

  async getUsers(dto: GetUsersDto) {
    try {
      return await this.userGrpc.getUsers(dto);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getUser(dto: GetUserDto) {
    const { id } = dto;
    try {
      return await this.userGrpc.getUser({ id });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async checkUserByEmail(email: string) {
    try {
      return await this.userGrpc.checkUserByEmail(email);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async createUser(dto: CreateUserDto) {
    try {
      return await this.userGrpc.createUser(dto);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
