import { TokenType } from '@libs/common/grpc/proto/user';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ParseBearerTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsOptional()
  @IsEnum(TokenType)
  type?: TokenType;
}
