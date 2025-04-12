import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from '@/account/dto/address.dto';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber('BR')
  phone: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}
