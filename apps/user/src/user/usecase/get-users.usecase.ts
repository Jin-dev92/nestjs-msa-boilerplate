import { GRPC_NAME, UseCase } from '@libs/common';
import { GetUsersDto } from './dto';
import { IGetUsersResponse, UserOutputPort } from '../port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetUsersUsecase
  implements UseCase<GetUsersDto, Promise<IGetUsersResponse>>
{
  constructor(
    @Inject(GRPC_NAME.USER_GRPC)
    private readonly userOutputPort: UserOutputPort,
  ) {}

  async execute(dto: GetUsersDto): Promise<IGetUsersResponse> {
    return await this.userOutputPort.getUsers(dto);
  }
}
