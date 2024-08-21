import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Headers,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ReturnCategoryDto } from './dtos/returnCategory.dto';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../enum/userType.enum';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/createCatgegory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';

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
  @Get('search')
  async findCategoryByName(
    @Headers('category-name') categoryName: string,
  ): Promise<CategoryEntity[]> {
    return this.categoryService.findCategoryByName(categoryName);
  }

  @Get(':id')
  async findCategoryById(@Param('id') id: number): Promise<CategoryEntity> {
    return this.categoryService.findCategoryById(id);
  }

  @Roles(UserType.ADMIN)
  @Put('/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Roles(UserType.ADMIN)
  @Delete('/:id')
  async deleteCategory(@Param('id') id: number): Promise<void> {
    await this.categoryService.deleteCategory(id);
  }
}
