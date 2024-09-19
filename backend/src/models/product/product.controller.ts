import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ReturnProductDto } from './dto/returnProduct.dto';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../enum/userType.enum';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult } from 'typeorm';
import { UpdateProductDto } from './dto/updateProduct.dto';

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

  @Get(':id')
  async findProductById(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<ProductEntity> {
    return this.productService.findProductById(productId);
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
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<DeleteResult> {
    return this.productService.deleteProduct(productId);
  }

  @Roles(UserType.ADMIN)
  @Put('/:productId')
  async updateProduct(
    @Body() updateProduct: UpdateProductDto,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(updateProduct, productId);
  }
}
