import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { Like, Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductMock } from '../__mocks__/product.mock';
import { CategoryService } from '../../../models/category/category.service';
import { CreateProductMock } from '../__mocks__/createProduct.mock';
import { CategoryMock } from '../../../models/category/__mocks__/category.mock';
import { NotFoundException } from '@nestjs/common';
import { returnDeleteMock } from '../../../__mocks__/returnDelete.mock';

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
            findOne: jest.fn().mockResolvedValue(ProductMock),
            save: jest.fn().mockResolvedValue(ProductMock),
            update: jest.fn().mockResolvedValue(ProductMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
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
      const product = await service.createProduct(CreateProductMock);

      expect(product).toEqual(ProductMock);
    });

    it('should return product after insert in DB', async () => {
      jest
        .spyOn(categoryService, 'findCategoryById')
        .mockRejectedValue(new Error());

      expect(service.createProduct(CreateProductMock)).rejects.toThrowError();
    });
  });

  describe('findProductByName', () => {
    it('should return products matching the name', async () => {
      const searchName = 'productNameMock';
      jest.spyOn(productRepository, 'find').mockResolvedValue([ProductMock]);

      const result = await service.findProductByName(searchName);

      expect(result).toEqual([ProductMock]);
      expect(productRepository.find).toHaveBeenCalledWith({
        where: {
          name: Like(`%${searchName}%`),
        },
        order: {
          name: 'ASC',
        },
      });
    });

    it('should throw NotFoundException if no products are found', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue([]);

      await expect(service.findProductByName('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if no name is provided', async () => {
      await expect(service.findProductByName('')).rejects.toThrow(
        new NotFoundException('Nome da categoria não fornecido.'),
      );
    });

    it('should order products by match score', async () => {
      const searchName = 'productName';
      const product1: ProductEntity = {
        ...ProductMock,
        name: 'nameProductMock',
      };
      const product2: ProductEntity = {
        ...ProductMock,
        name: 'productMockName',
      };

      jest
        .spyOn(productRepository, 'find')
        .mockResolvedValue([product1, product2]);

      const result = await service.findProductByName(searchName);

      expect(result).toEqual([product1, product2]);
    });
  });

  describe('deleteProduct', () => {
    it('should return product in find by id', async () => {
      const product = await service.findProductById(ProductMock.id);

      expect(product).toEqual(ProductMock);
    });

    it('should return error in product not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      expect(service.findProductById(ProductMock.id)).rejects.toThrowError();
    });

    it('should return deleted true in delete product', async () => {
      const deleted = await service.deleteProduct(ProductMock.id);

      expect(deleted).toEqual(returnDeleteMock);
    });
  });

  describe('updateProduct', () => {
    it('should return product after update', async () => {
      const product = await service.updateProduct(
        CreateProductMock,
        ProductMock.id,
      );

      expect(product).toEqual(ProductMock);
    });

    it('should error in update product', async () => {
      jest.spyOn(productRepository, 'save').mockRejectedValue(new Error());

      expect(
        service.updateProduct(CreateProductMock, ProductMock.id),
      ).rejects.toThrowError();
    });
  });

  describe('updateProductAmount', () => {
    it('should update the product amount successfully', async () => {
      const productId = ProductMock.id;
      const newAmount = 10;

      const updateSpy = jest
        .spyOn(productRepository, 'update')
        .mockResolvedValue(undefined);

      await service.updateProductAmount(productId, newAmount);

      expect(updateSpy).toHaveBeenCalledWith(productId, { amount: newAmount });
    });

    it('should throw an error if update fails', async () => {
      const productId = ProductMock.id;
      const newAmount = 10;

      jest.spyOn(productRepository, 'update').mockRejectedValue(new Error());

      await expect(
        service.updateProductAmount(productId, newAmount),
      ).rejects.toThrowError();
    });
  });
});
