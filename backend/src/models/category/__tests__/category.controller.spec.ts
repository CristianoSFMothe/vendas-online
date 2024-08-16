import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { CategoryMock } from '../__mocks__/category.mock';
import { CreateCategoryDto } from '../dtos/createCatgegory.dto';

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
            createCategory: jest.fn().mockResolvedValue(CategoryMock),
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
    it('should return an array of ReturnCategoryDto', async () => {
      const result = await categoryController.findAllCategories();
      expect(result).toEqual([CategoryMock]);
      expect(categoryService.findAllCategories).toHaveBeenCalled();
    });
  });

  describe('createCategory', () => {
    it('should return a CategoryEntity after creation', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'categoryNameMock', // Use the same name as in CategoryMock
      };
      const result = await categoryController.createCategory(createCategoryDto);
      expect(result).toEqual(CategoryMock);
      expect(categoryService.createCategory).toHaveBeenCalledWith(
        createCategoryDto,
      );
    });

    it('should throw an error if creation fails', async () => {
      jest
        .spyOn(categoryService, 'createCategory')
        .mockRejectedValue(new Error('Erro ao criar categoria'));

      await expect(
        categoryController.createCategory({ name: 'categoryNameMock' }),
      ).rejects.toThrowError('Erro ao criar categoria');
    });
  });
});
