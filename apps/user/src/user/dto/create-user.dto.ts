import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Min(8)
  @Max(16)
  @IsNotEmpty()
  @IsString()
  password: string;

  @Length(100)
  @IsNotEmpty()
  @IsString()
  username: string;
}
