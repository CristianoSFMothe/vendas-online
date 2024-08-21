import { ReturnCartProductDto } from '../../../models/cart-product/dtos/returnCartpProduct.dto';
import { CartEntity } from '../entities/cart.entity';

export class ReturnCartDto {
  id: number;
  cartProduct?: ReturnCartProductDto[];

  constructor(cart: CartEntity) {
    this.id = cart.id;
    this.cartProduct = cart.cartProduct
      ? cart.cartProduct.map(
          (cartProduct) => new ReturnCartProductDto(cartProduct),
        )
      : undefined;
  }
}
