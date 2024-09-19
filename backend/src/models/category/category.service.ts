import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Like, Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';

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

  async findCategoryById(categoryId: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    return category;
  }

  async findCategoryByName(name: string): Promise<CategoryEntity[]> {
    if (!name) {
      throw new NotFoundException('Nome da categoria não fornecido.');
    }

    const categories = await this.categoryRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
      order: {
        name: 'ASC',
      },
    });

    if (categories.length === 0) {
      throw new NotFoundException(
        'Nenhuma categoria encontrada com o nome fornecido.',
      );
    }

    categories.sort((a, b) => {
      const aScore = this.getMatchScore(a.name, name);
      const bScore = this.getMatchScore(b.name, name);
      return bScore - aScore;
    });

    return categories;
  }

  private getMatchScore(categoryName: string, searchName: string): number {
    const lowerCategoryName = categoryName.toLowerCase();
    const lowerSearchName = searchName.toLowerCase();
    const index = lowerCategoryName.indexOf(lowerSearchName);

    if (index === -1) {
      return 0;
    }

    return (searchName.length / (index + 1)) * 100;
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

  async deleteCategory(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    await this.categoryRepository.remove(category);
  }
}
