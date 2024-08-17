import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/createCatgegory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAllCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find();

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Nenhuma categoria encontrada.');
    }

    return categories;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findOneCategoryByName(
      createCategoryDto.name,
    ).catch(() => undefined);

    if (category) {
      throw new ConflictException('Já existe uma categoria com esse nome.');
    }
    return this.categoryRepository.save(createCategoryDto);
  }

  async findOneCategoryByName(name: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    return category;
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Já existe uma categoria com esse nome.');
      }

      category.name = updateCategoryDto.name;
    }

    return this.categoryRepository.save(category);
  }
}
