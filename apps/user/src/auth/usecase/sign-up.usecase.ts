import { GRPC_NAME, UseCase } from '@libs/common';
import { SignUpDto } from '@apps/user/auth';
import { UserDomain, UserOutputPort } from '@apps/user/user';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SignUpUsecase implements UseCase<SignUpDto, Promise<UserDomain>> {
  constructor(
    @Inject(GRPC_NAME.USER_GRPC)
    private readonly userOutputPort: UserOutputPort,
  ) {}
  async execute(dto: SignUpDto): Promise<UserDomain> {
    try {
      return await this.userOutputPort.createUser(new UserDomain(dto));
    } catch (e) {
      throw new BadRequestException('회원가입에 실패했습니다.');
    }
  }
}
