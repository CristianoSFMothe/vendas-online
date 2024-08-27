import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult, Like, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find();

    if (!products || products.length === 0) {
      throw new NotFoundException('Nenhum produto encontrado.');
    }

    return products;
  }

  async createProduct(createProduct: CreateProductDto): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(createProduct.categoryId);

    return this.productRepository.save({
      ...createProduct,
    });
  }

  async findProductByName(name: string): Promise<ProductEntity[]> {
    if (!name) {
      throw new NotFoundException('Nome da categoria não fornecido.');
    }

    const categories = await this.productRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
      order: {
        name: 'ASC',
      },
    });

    if (categories.length === 0) {
      throw new NotFoundException(
        'Nenhum produto encontrado com o nome fornecido.',
      );
    }

    categories.sort((a, b) => {
      const aScore = this.getMatchScore(a.name, name);
      const bScore = this.getMatchScore(b.name, name);
      return bScore - aScore;
    });

    return categories;
  }

  private getMatchScore(productName: string, searchName: string): number {
    const lowerProductName = productName.toLowerCase();
    const lowerSearchName = searchName.toLowerCase();
    const index = lowerProductName.indexOf(lowerSearchName);

    if (index === -1) {
      return 0;
    }

    return (searchName.length / (index + 1)) * 100;
  }

  async findProductById(productId: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado ou não existe');
    }

    return product;
  }

  async deleteProduct(productId: number): Promise<DeleteResult> {
    await this.findProductById(productId);

    return this.productRepository.delete({ id: productId });
  }

  async updateProduct(
    updateProduct: UpdateProductDto,
    productId: number,
  ): Promise<ProductEntity> {
    const product = await this.findProductById(productId);

    return this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }
}
