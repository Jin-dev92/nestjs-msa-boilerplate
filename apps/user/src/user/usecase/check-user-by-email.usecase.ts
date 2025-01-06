import { UseCase } from '@libs/common';
import { UserDomain } from '../domain';
import { UserOutputPort } from '../port';

export class CheckUserByEmailUsecase
  implements UseCase<string, Promise<UserDomain>>
{
  constructor(private readonly userOutputPort: UserOutputPort) {}
  async execute(email: string): Promise<UserDomain> {
    const user = await this.userOutputPort.checkUserByEmail(email);
    if (!user) {
      throw new Error('해당 유저는 존재하지 않습니다.');
    }
    return user;
  }
}
