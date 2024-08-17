import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductMock } from '../__mocks__/product.mock';
import { CategoryService } from '../../../models/category/category.service';
import { CreateProduct } from '../__mocks__/createProduct.mock';
import { CategoryMock } from '../../../models/category/__mocks__/category.mock';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: CategoryService,
          useValue: {
            findCategoryById: jest.fn().mockResolvedValue(CategoryMock),
          },
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([ProductMock]),
            findOne: jest.fn().mockResolvedValue([ProductMock]),
            save: jest.fn().mockResolvedValue(ProductMock),
            update: jest.fn().mockResolvedValue(ProductMock),
            delete: jest.fn().mockResolvedValue(ProductMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    categoryService = module.get<CategoryService>(CategoryService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = await service.findAll();

      expect(products).toEqual([ProductMock]);
    });

    it('should return error if products empty', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue([]);

      expect(service.findAll()).rejects.toThrowError();
    });

    it('should return error in exception', async () => {
      jest.spyOn(productRepository, 'find').mockRejectedValue(new Error());

      expect(service.findAll()).rejects.toThrowError();
    });
  });

  describe('createProduct', () => {
    it('should return product after insert in DB', async () => {
      const product = await service.createProduct(CreateProduct);

      expect(product).toEqual(ProductMock);
    });

    it('should return product after insert in DB', async () => {
      jest
        .spyOn(categoryService, 'findCategoryById')
        .mockRejectedValue(new Error());

      expect(service.createProduct(CreateProduct)).rejects.toThrowError();
    });
  });
});
