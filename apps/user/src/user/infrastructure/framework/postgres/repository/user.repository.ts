import { Repository } from 'typeorm';
import { UserEntity } from '../entity';
import { Injectable } from '@nestjs/common';
import { WhereClauseParser } from '@libs/common';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import {
  GetUserDto,
  GetUsersDto,
  IGetUsersResponse,
  UserDomain,
  UserEntityMapper,
  UserOutputPort,
} from '@apps/user/user';

@Injectable()
export class UserRepository implements UserOutputPort {
  constructor(private readonly userRepository: Repository<UserEntity>) {}

  async checkUserByEmail(email: string): Promise<UserDomain> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    return new UserEntityMapper(user).toDomain();
  }

  async createUser(user: UserDomain): Promise<UserDomain> {
    const { email, password, username } = user;
    const userEntity = await this.userRepository.save(
      this.userRepository.create({
        email,
        password,
        username,
      }),
    );
    return new UserEntityMapper(userEntity).toDomain();
  }

  async getUser(dto: GetUserDto): Promise<UserDomain> {
    const where: FindOptionsWhere<UserEntity> = {};
    const { id, email, username, role } = dto;
    if (id) {
      where.id = id;
    }
    if (email) {
      where.email = email;
    }
    if (username) {
      where.username = username;
    }
    if (role) {
      where.role = role;
    } // @todo 좀더 나은 로직으로 수정 예정
    const userEntity = await this.userRepository.findOneBy(where);
    return new UserEntityMapper(userEntity).toDomain();
  }

  async getUsers(dto: GetUsersDto): Promise<IGetUsersResponse> {
    const { where, skip, take } = new WhereClauseParser<GetUsersDto>(
      dto,
    ).parse();

    const [userEntities, count] = await this.userRepository.findAndCount({
      where,
      skip,
      take,
    });

    return {
      users: userEntities.map((userEntity) =>
        new UserEntityMapper(userEntity).toDomain(),
      ),
      total: count,
    };
  }
}
