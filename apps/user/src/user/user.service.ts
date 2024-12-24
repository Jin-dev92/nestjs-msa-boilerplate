import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@libs/database';
import { Repository } from 'typeorm';
import { CreateUserDto, GetUsersDto } from './dto';
import { UserMicroService } from '@libs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // private authService: AuthService,
  ) {}
  async createUser(dto: CreateUserDto) {
    await this.checkExistByEmail(dto.email);
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }

  async getUsers(dto: GetUsersDto) {
    const { skip, take } = dto;
    return await this.userRepository.find({ ...dto, skip, take });
  }

  async getUserById(dto: UserMicroService.GetUserRequest) {
    const user = await this.userRepository.findOne({
      where: {
        id: dto.id,
      },
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return user;
  }

  async checkUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return user;
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
