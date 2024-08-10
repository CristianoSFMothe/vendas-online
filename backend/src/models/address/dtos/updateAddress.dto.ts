import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  complement?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  street: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
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
