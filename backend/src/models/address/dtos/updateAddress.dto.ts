import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  neighborhood: string;

  @IsInt()
  @IsOptional()
  numberAddress?: number;

  @IsString()
  @IsOptional()
  cep?: string;

  @IsInt()
  @IsOptional()
  cityId?: number;
}
