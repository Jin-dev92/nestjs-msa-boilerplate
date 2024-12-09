import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@libs/database';
import { Repository } from 'typeorm';
import { EncryptionService } from '@libs/encryption';
import { GetUserDto, GetUsersDto } from './dto';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { UserMicroService } from '@libs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async signUp(dto: UserMicroService.SingUpRequest) {
    try {
      await this.checkExistByEmail(dto.email); // 중복 확인
      const user = this.userRepository.create({
        ...dto,
        password: await this.encryptionService.hashPassword(dto.password),
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

  async getUser(dto: GetUserDto) {
    const where: FindOptionsWhere<User> = {
      ...dto,
    };
    return await this.userRepository.findOne({
      where,
    });
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
