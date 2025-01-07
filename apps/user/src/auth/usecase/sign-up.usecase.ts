import { UseCase } from '@libs/common';
import { SignUpDto } from '@apps/user/auth';
import { UserDomain } from '@apps/user/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SignUpUsecase implements UseCase<SignUpDto, UserDomain> {
  async execute(dto: SignUpDto): Promise<UserDomain> {
    return undefined;
  }
}
