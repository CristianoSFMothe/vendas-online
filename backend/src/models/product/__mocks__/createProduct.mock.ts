import { CategoryMock } from '../../../models/category/__mocks__/category.mock';
import { CreateProductDto } from '../dtos/createProduct.dto';

export const CreateProduct: CreateProductDto = {
  categoryId: CategoryMock.id,
  image: 'lkfdjsafkldsa',
  name: 'name mock product',
  price: 25.0,
  amount: 100,
};
