import { GetUserDto, GetUsersDto } from '../usecase';
import { UserDomain } from '../domain';

export interface IGetUsersResponse {
  users: UserDomain[];
  total: number;
}

export interface UserOutputPort {
  checkUserByEmail(email: string): Promise<UserDomain>;
  createUser(user: UserDomain): Promise<UserDomain>;
  getUser(dto: GetUserDto): Promise<UserDomain>;
  getUsers(dto: GetUsersDto): Promise<IGetUsersResponse>;
}
