import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CommonFindManyDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  skip: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  take: number;
}
