import {GRPC_NAME, UseCase} from '@libs/common';
import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {SignUpDto} from "./dto";
import {UserDomain, UserOutputPort} from "../../user";

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
