import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(16)
  @IsNotEmpty()
  @IsString()
  password: string;
}
