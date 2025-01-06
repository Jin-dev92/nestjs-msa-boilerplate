import { CommonFindManyDto } from '@libs/common';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoleEnum } from '@libs/database';

export class GetUsersDto extends CommonFindManyDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsEnum(UserRoleEnum)
  @IsOptional()
  role?: UserRoleEnum;
}
