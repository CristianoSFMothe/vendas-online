import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
