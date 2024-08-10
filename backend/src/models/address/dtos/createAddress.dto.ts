import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsOptional()
  complement: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  neighborhood: string;

  @IsInt()
  @IsNotEmpty()
  numberAddress: number;

  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsInt()
  @IsOptional()
  cityId: number;
}
