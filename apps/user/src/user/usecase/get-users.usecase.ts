import { UseCase } from '@libs/common';
import { GetUsersDto } from './dto';
import { IGetUsersResponse, UserOutputPort } from '../port';

export class GetUsersUsecase
  implements UseCase<GetUsersDto, Promise<IGetUsersResponse>>
{
  constructor(private readonly userOutputPort: UserOutputPort) {}

  async execute(dto: GetUsersDto): Promise<IGetUsersResponse> {
    return await this.userOutputPort.getUsers(dto);
  }
}
