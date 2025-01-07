import { UserDomain, UserEntity } from '@apps/user/user';

export class UserEntityMapper {
  constructor(private readonly user: UserEntity) {}

  toDomain(): UserDomain {
    const domain = new UserDomain(this.user);
    domain.setId(this.user.id);
    return domain;
  }
}
