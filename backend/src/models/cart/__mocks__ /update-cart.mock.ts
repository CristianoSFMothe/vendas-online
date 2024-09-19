import { ProductMock } from '../../../models/product/__mocks__/product.mock';
import { UpdateCartDto } from '../dto/updateCart.dto';

export const updateCartMock: UpdateCartDto = {
  amount: 54638,
  productId: ProductMock.id,
};
