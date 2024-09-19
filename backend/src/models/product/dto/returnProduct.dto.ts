import { ProductEntity } from '../entities/product.entity';

export class ReturnProductDto {
  id: number;
  name: string;
  price: number;
  amount: number;
  image: string;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.amount = product.amount;
    this.image = product.image;
  }
}
