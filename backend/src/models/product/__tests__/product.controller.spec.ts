import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { ProductMock } from '../__mocks__/product.mock';
import { ReturnProductDto } from '../dto/returnProduct.dto';
import { CreateProductMock } from '../__mocks__/createProduct.mock';
import { returnDeleteMock } from '../../../__mocks__/returnDelete.mock';
import { DeleteResult } from 'typeorm';
import { updateProductMock } from '../__mocks__/updateProduct.mock';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

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
            deleteProduct: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProduct: jest.fn().mockResolvedValue(ProductMock),
          },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await productController.findAll();
      const expected = [new ReturnProductDto(ProductMock)];

      expect(result.length).toBe(expected.length);
      result.forEach((item, index) => {
        expect(item).toMatchObject(expected[index]);
      });

      expect(productService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle errors properly', async () => {
      jest.spyOn(productService, 'findAll').mockRejectedValueOnce(new Error());

      await expect(productController.findAll()).rejects.toThrowError();
    });
  });

  describe('createProduct', () => {
    it('should create and return a product', async () => {
      const result = await productController.createProduct(CreateProductMock);
      const expected = new ReturnProductDto(ProductMock);

      expect(result).toMatchObject(expected);
      expect(productService.createProduct).toHaveBeenCalledWith(
        CreateProductMock,
      );
      expect(productService.createProduct).toHaveBeenCalledTimes(1);
    });

    it('should handle errors properly when creating a product', async () => {
      jest
        .spyOn(productService, 'createProduct')
        .mockRejectedValueOnce(new Error());

      await expect(
        productController.createProduct(CreateProductMock),
      ).rejects.toThrowError();
    });
  });

  describe('findProductByName', () => {
    it('should return products matching the name', async () => {
      const searchName = 'name mock product';
      const result = await productController.findProductByName(searchName);
      const expected = [new ReturnProductDto(ProductMock)];

      expect(result.length).toBe(expected.length);
      result.forEach((item, index) => {
        expect(item).toMatchObject(expected[index]);
      });

      expect(productService.findProductByName).toHaveBeenCalledWith(searchName);
      expect(productService.findProductByName).toHaveBeenCalledTimes(1);
    });

    it('should handle errors properly when searching for products', async () => {
      jest
        .spyOn(productService, 'findProductByName')
        .mockRejectedValueOnce(new Error());

      await expect(
        productController.findProductByName('invalid name'),
      ).rejects.toThrowError();
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return DeleteResult', async () => {
      const productId = 1;

      const result: DeleteResult = await productController.deleteProduct(
        productId,
      );

      expect(result).toEqual(returnDeleteMock);
      expect(productService.deleteProduct).toHaveBeenCalledWith(productId);
    });
  });

  describe('updateProduct', () => {
    it('should return updated product', async () => {
      const productId = ProductMock.id;
      const result = await productController.updateProduct(
        updateProductMock,
        productId,
      );

      expect(result).toEqual(ProductMock);
      expect(productService.updateProduct).toHaveBeenCalledWith(
        updateProductMock,
        productId,
      );
    });

    it('should handle errors when updating a product', async () => {
      const productId = ProductMock.id;
      jest
        .spyOn(productService, 'updateProduct')
        .mockRejectedValueOnce(new Error());

      await expect(
        productController.updateProduct(updateProductMock, productId),
      ).rejects.toThrowError();
    });
  });
});
