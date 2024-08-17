import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { CategoryMock } from '../__mocks__/category.mock';
import { CreateCategoryMock } from '../__mocks__/createCategory.mock';
import { UpdatedCategoryMock } from '../__mocks__/updateCategory.mock';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAllCategories: jest.fn().mockResolvedValue([CategoryMock]),
            findCategoryById: jest.fn().mockResolvedValue(CategoryMock),
            findCategoryByName: jest.fn().mockResolvedValue([CategoryMock]),
            createCategory: jest.fn().mockResolvedValue(CategoryMock),
            updateCategory: jest.fn().mockResolvedValue(CategoryMock),
            deleteCategory: jest.fn().mockResolvedValue(void 0),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllCategories', () => {
    it('should return an array of categories', async () => {
      const result = await controller.findAllCategories();
      expect(result).toEqual([CategoryMock]);
    });
  });

  describe('createCategory', () => {
    it('should return the created category', async () => {
      const result = await controller.createCategory(CreateCategoryMock);
      expect(result).toEqual(CategoryMock);
      expect(service.createCategory).toHaveBeenCalledWith(CreateCategoryMock);
    });

    it('should throw ConflictException if category already exists', async () => {
      jest
        .spyOn(service, 'createCategory')
        .mockRejectedValue(new ConflictException());

      await expect(
        controller.createCategory(CreateCategoryMock),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findCategoryById', () => {
    it('should return a category by id', async () => {
      const result = await controller.findCategoryById(CategoryMock.id);
      expect(result).toEqual(CategoryMock);
    });

    it('should throw NotFoundException if no category is found', async () => {
      jest
        .spyOn(service, 'findCategoryById')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.findCategoryById(CategoryMock.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findCategoryByName', () => {
    it('should return a list of categories by name', async () => {
      const result = await controller.findCategoryByName(CategoryMock.name);
      expect(result).toEqual([CategoryMock]);
    });

    it('should throw NotFoundException if no category is found by name', async () => {
      jest
        .spyOn(service, 'findCategoryByName')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.findCategoryByName(CategoryMock.name),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCategory', () => {
    it('should return the updated category', async () => {
      const result = await controller.updateCategory(
        CategoryMock.id,
        UpdatedCategoryMock,
      );
      expect(result).toEqual(CategoryMock);
      expect(service.updateCategory).toHaveBeenCalledWith(
        CategoryMock.id,
        UpdatedCategoryMock,
      );
    });

    it('should throw NotFoundException if no category is found for update', async () => {
      jest
        .spyOn(service, 'updateCategory')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.updateCategory(CategoryMock.id, UpdatedCategoryMock),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if there is a conflict during update', async () => {
      jest
        .spyOn(service, 'updateCategory')
        .mockRejectedValue(new ConflictException());

      await expect(
        controller.updateCategory(CategoryMock.id, UpdatedCategoryMock),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteCategory', () => {
    it('should successfully delete a category', async () => {
      await controller.deleteCategory(CategoryMock.id);
      expect(service.deleteCategory).toHaveBeenCalledWith(CategoryMock.id);
    });

    it('should throw NotFoundException if no category is found for deletion', async () => {
      jest
        .spyOn(service, 'deleteCategory')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.deleteCategory(CategoryMock.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
