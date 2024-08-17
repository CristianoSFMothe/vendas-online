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
            updateCategory: jest.fn(),
            deleteCategory: jest.fn(), // Mock para o método deleteCategory
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
        throw new ConflictException('Category with this name already exists.');
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
        .mockRejectedValue(new NotFoundException('Category not found.'));

      await expect(
        categoryController.findOneCategoryByName('NonExistentName'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCategory', () => {
    it('should return an updated CategoryEntity after updating', async () => {
      const id = 1;
      const updateCategoryDto = {
        name: 'UpdatedCategoryName',
      };
      jest
        .spyOn(categoryService, 'updateCategory')
        .mockResolvedValue(CategoryMock);

      const result = await categoryController.updateCategory(
        id,
        updateCategoryDto,
      );
      expect(result).toEqual(CategoryMock);
      expect(categoryService.updateCategory).toHaveBeenCalledWith(
        id,
        updateCategoryDto,
      );
    });

    it('should throw NotFoundException if category does not exist', async () => {
      const id = 1;
      const updateCategoryDto = {
        name: 'UpdatedCategoryName',
      };
      jest
        .spyOn(categoryService, 'updateCategory')
        .mockRejectedValue(new NotFoundException('Category not found.'));

      await expect(
        categoryController.updateCategory(id, updateCategoryDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if category with the same name already exists', async () => {
      const id = 1;
      const updateCategoryDto = {
        name: 'ExistingCategoryName',
      };
      jest
        .spyOn(categoryService, 'updateCategory')
        .mockRejectedValue(
          new ConflictException('Category with this name already exists.'),
        );

      await expect(
        categoryController.updateCategory(id, updateCategoryDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteCategory', () => {
    it('should successfully delete a category', async () => {
      const id = 1;
      await categoryController.deleteCategory(id);
      expect(categoryService.deleteCategory).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      const id = 1;
      jest
        .spyOn(categoryService, 'deleteCategory')
        .mockRejectedValue(new NotFoundException('Category not found.'));

      await expect(categoryController.deleteCategory(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
