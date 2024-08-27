import { IsNotEmpty, IsNumber } from 'class-validator';

export class InsertCartDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
