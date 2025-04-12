import { IsOptional, IsString, Length } from 'class-validator';

export class AddressDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  street?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  number?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  region?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  state?: string;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  cep?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  complement?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  reference?: string;
}
