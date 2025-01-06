import { CommonFindManyDto, UserMicroService } from '@libs/common';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class GetUsersDto extends CommonFindManyDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsEnum(UserMicroService.UserRoleEnum)
  @IsOptional()
  role?: UserMicroService.UserRoleEnum;
}
