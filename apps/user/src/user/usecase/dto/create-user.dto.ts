import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(16)
  @IsNotEmpty()
  @IsString()
  password: string;

  @Length(100)
  @IsNotEmpty()
  @IsString()
  username: string;
}
