import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  // @IsNotEmpty()
  // @IsString()
  // token: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(16)
  @IsNotEmpty()
  @IsString()
  password: string;

  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  username: string;
}
