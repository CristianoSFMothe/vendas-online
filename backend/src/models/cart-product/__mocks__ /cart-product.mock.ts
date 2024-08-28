import { cartMock } from '../../../models/cart/__mocks__ /cart.mock';
import { CartProductEntity } from '../entities/cart-product.entity';
import { ProductMock } from '../../../models/product/__mocks__/product.mock';

export const cartProductMock: CartProductEntity = {
  amount: 5435,
  cartId: cartMock.id,
  createdAt: new Date(),
  id: 234,
  productId: ProductMock.id,
  updatedAt: new Date(),
};
