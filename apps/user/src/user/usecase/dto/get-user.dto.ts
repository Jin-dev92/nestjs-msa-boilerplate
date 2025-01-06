import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRoleEnum } from '@libs/common/grpc/proto/user';

export class GetUserDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  id?: number;

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
