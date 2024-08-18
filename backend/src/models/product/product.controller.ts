import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ReturnProductDto } from './dtos/returnProduct.dto';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../enum/userType.enum';
import { CreateProductDto } from './dtos/createProduct.dto';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult } from 'typeorm';

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

  @Roles(UserType.ADMIN)
  @Post()
  async createProduct(
    @Body() createProduct: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }

  @Roles(UserType.ADMIN, UserType.USER)
  @Get('search')
  async findProductByName(
    @Headers('product-name') productName: string,
  ): Promise<ProductEntity[]> {
    return this.productService.findProductByName(productName);
  }

  @Roles(UserType.ADMIN)
  @Delete('/:productId')
  async deleteProduct(
    @Param('productId') productId: number,
  ): Promise<DeleteResult> {
    return this.productService.deleteProduct(productId);
  }
}
