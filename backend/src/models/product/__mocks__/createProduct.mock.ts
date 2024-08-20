import { CategoryMock } from '../../../models/category/__mocks__/category.mock';
import { CreateProductDto } from '../dtos/createProduct.dto';

export const CreateProductMock: CreateProductDto = {
  categoryId: CategoryMock.id,
  image: 'https://images.jpg',
  name: 'name mock product',
  price: 25.0,
  amount: 100,
};
