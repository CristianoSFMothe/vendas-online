import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './createCatgegory.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
