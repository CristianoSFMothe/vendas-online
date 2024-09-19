import { CategoryMock } from '../../../models/category/__mocks__/category.mock';
import { UpdateProductDto } from '../dto/updateProduct.dto';

export const updateProductMock: UpdateProductDto = {
  categoryId: CategoryMock.id,
  image: 'https://images.jpg',
  name: 'update Product Mock',
  price: 43.0,
  amount: 100,
};
