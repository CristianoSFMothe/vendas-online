import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ReturnCategoryDto } from './dtos/returnCategory.dto';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../enum/userType.enum';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/createCatgegory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(UserType.USER, UserType.ADMIN)
  @Get()
  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    return this.categoryService.findAllCategories();
  }

  @Roles(UserType.ADMIN)
  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Get('/:categoryName')
  async findOneCategoryByName(
    @Param('name') name: string,
  ): Promise<CategoryEntity> {
    return this.categoryService.findOneCategoryByName(name);
  }
}
