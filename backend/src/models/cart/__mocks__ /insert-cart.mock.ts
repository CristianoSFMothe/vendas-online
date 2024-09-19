import { ProductMock } from '../../../models/product/__mocks__/product.mock';
import { InsertCartDto } from '../dto/insertCart.dto';

export const insertCartMock: InsertCartDto = {
  amount: 535,
  productId: ProductMock.id,
};
