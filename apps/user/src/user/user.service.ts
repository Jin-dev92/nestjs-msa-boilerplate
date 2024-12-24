import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@libs/database';
import { Repository } from 'typeorm';
import { GetUsersDto } from './dto';
import { UserMicroService } from '@libs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async signUp(dto: UserMicroService.SingUpRequest) {
    const { password, email } = dto;
    const response = await this.authService.hashPasswordExecutes({
      password,
    });
    try {
      await this.checkExistByEmail(email); // 중복 확인
      const user = this.userRepository.create({
        ...dto,
        password: response.hash,
      });
      return await this.userRepository.save(user);
    } catch (e) {
      throw new BadRequestException(e);
    }
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
