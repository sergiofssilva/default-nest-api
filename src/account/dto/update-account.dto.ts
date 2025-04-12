import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { AddressDto } from './address.dto';
import { Type } from 'class-transformer';

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  nickname: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}
