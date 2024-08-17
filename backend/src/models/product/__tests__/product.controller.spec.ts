import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { ProductMock } from '../__mocks__/product.mock';
import { ReturnProductDto } from '../dtos/returnProduct.dto';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { CreateProduct } from '../__mocks__/createProduct.mock';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([ProductMock]),
            createProduct: jest.fn().mockResolvedValue(ProductMock),
            findProductByName: jest.fn().mockResolvedValue([ProductMock]),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await controller.findAll();
      const expected = [new ReturnProductDto(ProductMock)];

      // Compare arrays of DTOs
      expect(result.length).toBe(expected.length);
      result.forEach((item, index) => {
        expect(item).toMatchObject(expected[index]);
      });

      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle errors properly', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new Error());

      await expect(controller.findAll()).rejects.toThrowError();
    });
  });

  describe('createProduct', () => {
    it('should create and return a product', async () => {
      const result = await controller.createProduct(CreateProduct);
      const expected = new ReturnProductDto(ProductMock);

      // Compare result to expected DTO
      expect(result).toMatchObject(expected);
      expect(service.createProduct).toHaveBeenCalledWith(CreateProduct);
      expect(service.createProduct).toHaveBeenCalledTimes(1);
    });

    it('should handle errors properly when creating a product', async () => {
      jest.spyOn(service, 'createProduct').mockRejectedValueOnce(new Error());

      await expect(
        controller.createProduct(CreateProduct),
      ).rejects.toThrowError();
    });
  });

  describe('findProductByName', () => {
    it('should return products matching the name', async () => {
      const searchName = 'name mock product';
      const result = await controller.findProductByName(searchName);
      const expected = [new ReturnProductDto(ProductMock)];

      // Compare arrays of DTOs
      expect(result.length).toBe(expected.length);
      result.forEach((item, index) => {
        expect(item).toMatchObject(expected[index]);
      });

      expect(service.findProductByName).toHaveBeenCalledWith(searchName);
      expect(service.findProductByName).toHaveBeenCalledTimes(1);
    });

    it('should handle errors properly when searching for products', async () => {
      jest
        .spyOn(service, 'findProductByName')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.findProductByName('invalid name'),
      ).rejects.toThrowError();
    });
  });
});
