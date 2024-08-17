import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryMock } from '../__mocks__/category.mock';
import { CreateCategoryMock } from '../__mocks__/createCategory.mock'; // Importar o mock aqui
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
      jest.spyOn(service, 'findOneCategoryByName').mockResolvedValue(null); // Simula que não existe uma categoria com o nome fornecido

      const category = await service.createCategory(CreateCategoryMock);

      expect(category).toEqual(CategoryMock);
      expect(categoryRepository.save).toHaveBeenCalledWith(CreateCategoryMock);
    });

    it('should throw ConflictException if category already exists', async () => {
      jest
        .spyOn(service, 'findOneCategoryByName')
        .mockResolvedValue(CategoryMock); // Simula que já existe uma categoria com o nome fornecido

      await expect(service.createCategory(CreateCategoryMock)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw an error if saving fails', async () => {
      jest.spyOn(service, 'findOneCategoryByName').mockResolvedValue(null); // Simula que não existe uma categoria com o nome fornecido
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
});
