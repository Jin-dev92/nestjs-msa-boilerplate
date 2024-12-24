import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@libs/database';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto';
import { UserMicroService } from '@libs/common';
import { GetUsersRequest } from '@libs/common/grpc/proto/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // private authService: AuthService,
  ) {}
  async createUserExecutes(dto: CreateUserDto) {
    await this.checkExistByEmail(dto.email);
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }

  async getUsersExecutes(
    dto: GetUsersRequest,
  ): Promise<UserMicroService.GetUsersResponse> {
    const { skip, take } = dto;
    const users = await this.userRepository.find({ ...dto, skip, take });
    return { users };
  }

  async getUserByIdExecutes(
    dto: UserMicroService.GetUserRequest,
  ): Promise<UserMicroService.GetUserResponse> {
    const user = await this.userRepository.findOne({
      where: {
        id: dto.id,
      },
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return { user };
  }

  async checkUserByEmailExecutes(
    payload: UserMicroService.CheckUserByEmailRequest,
  ): Promise<UserMicroService.CheckUserByEmailResponse> {
    const { email } = payload;
    const user = await this.userRepository.findOneBy({
      email,
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return { user };
  }

  /*  private function */
  private async checkExistByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });
    if (user) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }
  }
}
