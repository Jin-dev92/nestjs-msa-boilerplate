import {GRPC_NAME, UseCase} from '@libs/common';
import {UserDomain} from '../domain';
import {UserOutputPort} from '../port';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';

@Injectable()
export class CheckUserByEmailUsecase
  implements UseCase<string, Promise<UserDomain>>
{
  constructor(
    @Inject(GRPC_NAME.USER_GRPC)
    private readonly userOutputPort: UserOutputPort,
  ) {}
  async execute(email: string): Promise<UserDomain> {
    const user = await this.userOutputPort.checkUserByEmail(email);
    if (!user) {
      throw new NotFoundException('해당 유저는 존재하지 않습니다.');
    }
    return user;
  }
}
