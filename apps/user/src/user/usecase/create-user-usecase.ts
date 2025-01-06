import { UseCase } from '@libs/common';
import { CreateUserDto } from './dto';
import { UserOutputPort } from '../port';
import { UserDomain } from '../domain';

export class CreateUserUsecase
  implements UseCase<CreateUserDto, Promise<UserDomain>>
{
  constructor(private readonly userOutputPort: UserOutputPort) {}

  async execute(dto: CreateUserDto): Promise<UserDomain> {
    const isExist = await this.userOutputPort.checkUserByEmail(dto.email);
    if (isExist) {
      throw new Error('해당 이메일로 이미 가입이 되어있습니다.');
    }
    const userDomain = new UserDomain({
      email: dto.email,
      password: dto.password,
      username: dto.username,
    });
    return await this.userOutputPort.createUser(userDomain);
  }
}
