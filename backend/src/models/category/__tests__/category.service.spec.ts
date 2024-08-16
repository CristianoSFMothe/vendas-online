import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryMock } from '../__mocks__/category.mock';
import { CreateCategoryMock } from '../__mocks__/createCategory.mock';

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

  describe('findAll', () => {
    it('should return list category', async () => {
      const categories = await service.findAllCategories();

      expect(categories).toEqual([CategoryMock]);
    });

    it('should return error in list category empty', async () => {
      jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);

      expect(service.findAllCategories()).rejects.toThrowError();
    });

    it('should return error in list category exceptions', async () => {
      jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());

      expect(service.findAllCategories()).rejects.toThrowError();
    });
  });

  it('should return category after save', async () => {
    const category = await service.createCategory(CreateCategoryMock);

    expect(category).toEqual(CategoryMock);
  });

  it('should return erro in exception', async () => {
    jest.spyOn(categoryRepository, 'save').mockRejectedValue(new Error());

    expect(service.createCategory(CreateCategoryMock)).rejects.toThrowError();
  });
});
