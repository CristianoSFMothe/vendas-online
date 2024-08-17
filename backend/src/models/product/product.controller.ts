import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { ReturnProductDto } from './dtos/returnProduct.dto';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../enum/userType.enum';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(UserType.ADMIN, UserType.USER)
  @Get()
  async findAll(): Promise<ReturnProductDto[]> {
    return (await this.productService.findAll()).map(
      (product) => new ReturnProductDto(product),
    );
  }
}
