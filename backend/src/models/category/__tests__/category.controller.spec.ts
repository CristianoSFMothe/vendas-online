import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoryMock } from '../__mocks__/category.mock';
import { CreateCategoryMock } from '../__mocks__/createCategory.mock';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAllCategories: jest.fn().mockResolvedValue([CategoryMock]),
            createCategory: jest.fn(),
            findOneCategoryByName: jest.fn(),
          },
        },
      ],
    }).compile();

    categoryController = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(categoryController).toBeDefined();
  });

  describe('findAllCategories', () => {
    it('should return an array of CategoryEntity', async () => {
      const result = await categoryController.findAllCategories();
      expect(result).toEqual([CategoryMock]);
      expect(categoryService.findAllCategories).toHaveBeenCalled();
    });
  });

  describe('createCategory', () => {
    it('should return a CategoryEntity after creation', async () => {
      jest
        .spyOn(categoryService, 'createCategory')
        .mockResolvedValue(CategoryMock);
      const result = await categoryController.createCategory(
        CreateCategoryMock,
      );
      expect(result).toEqual(CategoryMock);
      expect(categoryService.createCategory).toHaveBeenCalledWith(
        CreateCategoryMock,
      );
    });

    it('should throw ConflictException if category already exists', async () => {
      jest
        .spyOn(categoryService, 'findOneCategoryByName')
        .mockResolvedValue(CategoryMock);
      jest.spyOn(categoryService, 'createCategory').mockImplementation(() => {
        throw new ConflictException('Já existe uma categoria com esse nome.');
      });

      await expect(
        categoryController.createCategory(CreateCategoryMock),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOneCategoryByName', () => {
    it('should return a CategoryEntity if category exists', async () => {
      jest
        .spyOn(categoryService, 'findOneCategoryByName')
        .mockResolvedValue(CategoryMock);

      const result = await categoryController.findOneCategoryByName(
        CategoryMock.name,
      );
      expect(result).toEqual(CategoryMock);
      expect(categoryService.findOneCategoryByName).toHaveBeenCalledWith(
        CategoryMock.name,
      );
    });

    it('should throw NotFoundException if category does not exist', async () => {
      jest
        .spyOn(categoryService, 'findOneCategoryByName')
        .mockRejectedValue(new NotFoundException('Categoria não encontrada.'));

      await expect(
        categoryController.findOneCategoryByName('NonExistentName'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
