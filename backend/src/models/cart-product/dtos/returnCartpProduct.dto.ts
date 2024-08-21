import { ReturnProductInCartDto } from '../../../models/product/dtos/returnProductInCart.dto';
import { ReturnCartDto } from '../../../models/cart/dtos/returnCart.dto';
import { CartProductEntity } from '../entities/cart-product.entity';

export class ReturnCartProductDto {
  id: number;
  cartId: number;
  productId: number;
  amount: number;
  product?: ReturnProductInCartDto;
  cart?: ReturnCartDto;

  constructor(cartProduct: CartProductEntity) {
    this.id = cartProduct.id;
    this.cartId = cartProduct.cartId;
    this.productId = cartProduct.productId;
    this.amount = cartProduct.amount;
    this.product = cartProduct.product
      ? new ReturnProductInCartDto(cartProduct.product)
      : undefined;
    this.cart = cartProduct.cart
      ? new ReturnCartDto(cartProduct.cart)
      : undefined;
  }
}
