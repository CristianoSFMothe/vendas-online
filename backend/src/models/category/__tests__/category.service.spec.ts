import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryMock } from '../__mocks__/category.mock';
import { CreateCategoryMock } from '../__mocks__/createCategory.mock';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([CategoryMock]),
            findOne: jest.fn().mockResolvedValue(CategoryMock),
            save: jest.fn().mockResolvedValue(CategoryMock),
            update: jest.fn().mockResolvedValue(CategoryMock),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  describe('findAllCategories', () => {
    it('should return a list of categories', async () => {
      const categories = await service.findAllCategories();
      expect(categories).toEqual([CategoryMock]);
    });

    it('should throw an error if no categories found', async () => {
      jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);

      await expect(service.findAllCategories()).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if there is a database exception', async () => {
      jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());

      await expect(service.findAllCategories()).rejects.toThrow(Error);
    });
  });

  describe('createCategory', () => {
    it('should return a category after save', async () => {
      jest.spyOn(service, 'findOneCategoryByName').mockResolvedValue(null);

      const category = await service.createCategory(CreateCategoryMock);

      expect(category).toEqual(CategoryMock);
      expect(categoryRepository.save).toHaveBeenCalledWith(CreateCategoryMock);
    });

    it('should throw ConflictException if category already exists', async () => {
      jest
        .spyOn(service, 'findOneCategoryByName')
        .mockResolvedValue(CategoryMock);

      await expect(service.createCategory(CreateCategoryMock)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw an error if saving fails', async () => {
      jest.spyOn(service, 'findOneCategoryByName').mockResolvedValue(null);
      jest.spyOn(categoryRepository, 'save').mockRejectedValue(new Error());

      await expect(service.createCategory(CreateCategoryMock)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('findOneCategoryByName', () => {
    it('should return a category by name', async () => {
      const category = await service.findOneCategoryByName(CategoryMock.name);
      expect(category).toEqual(CategoryMock);
    });

    it('should throw NotFoundException if no category found', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.findOneCategoryByName(CategoryMock.name),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCategory', () => {
    it('should update a category successfully', async () => {
      const id = 123;
      const updateCategoryDto = { name: 'UpdatedName' };
      const existingCategory = { ...CategoryMock, id };

      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValueOnce(existingCategory as any)
        .mockResolvedValueOnce(null);

      jest.spyOn(categoryRepository, 'save').mockResolvedValue({
        ...existingCategory,
        name: updateCategoryDto.name,
      } as any);

      const result = await service.updateCategory(id, updateCategoryDto);
      expect(result.name).toBe(updateCategoryDto.name);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(categoryRepository.save).toHaveBeenCalledWith({
        ...existingCategory,
        name: updateCategoryDto.name,
      });
    });

    it('should throw NotFoundException if category does not exist', async () => {
      const id = 123;
      const updateCategoryDto = { name: 'UpdatedName' };

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateCategory(id, updateCategoryDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if another category with the same name exists', async () => {
      const id = 123;
      const updateCategoryDto = { name: 'UpdatedName' };
      const existingCategory = { ...CategoryMock, id };
      const conflictingCategory = { ...existingCategory, id: 999 };

      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValueOnce(existingCategory as any)
        .mockResolvedValueOnce(conflictingCategory as any);

      await expect(
        service.updateCategory(id, updateCategoryDto),
      ).rejects.toThrow(ConflictException);
    });
  });
});
