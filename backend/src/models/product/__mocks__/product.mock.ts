import { CategoryMock } from '../../../models/category/__mocks__/category.mock';
import { ProductEntity } from '../entities/product.entity';

export const ProductMock: ProductEntity = {
  categoryId: CategoryMock.id,
  id: 7435,
  image: 'https://imageMock.com',
  name: 'productNameMock',
  price: 34.2,
  createdAt: new Date(),
  updatedAt: new Date(),
};
