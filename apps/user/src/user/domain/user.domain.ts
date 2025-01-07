import { UserRoleEnum } from '@libs/common/grpc/proto/user';

export class UserDomain {
  private _id: number;
  private readonly _email: string;
  private readonly _password: string;
  private readonly _username: string;
  private readonly _role: UserRoleEnum;

  constructor(dto: {
    email: string;
    password: string;
    username: string;
    role?: UserRoleEnum;
  }) {
    const { email, password, username, role = UserRoleEnum.USER } = dto;
    // this._id = id;
    this._email = email;
    this._password = password;
    this._username = username;
    this._role = role;
  }
  public setId(id: number) {
    this._id = id;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get username(): string {
    return this._username;
  }

  get role(): UserRoleEnum {
    return this._role;
  }

  get id(): number {
    return this._id;
  }

  public toJSON() {
    return {
      email: this._email,
      username: this._username,
      role: this._role,
    };
  }
}
