import { GRPC_NAME, UseCase } from '@libs/common';
import { GetUserDto } from './dto';
import { UserDomain } from '../domain';
import { UserOutputPort } from '../port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetUserUsecase
  implements UseCase<GetUserDto, Promise<UserDomain>>
{
  constructor(
    @Inject(GRPC_NAME.USER_GRPC)
    private readonly userOutputPort: UserOutputPort,
  ) {}
  async execute(dto: GetUserDto): Promise<UserDomain> {
    const user = await this.userOutputPort.getUser(dto);
    if (!user) {
      throw new Error('해당 유저는 존재하지 않습니다.');
    }
    return user;
  }
}
