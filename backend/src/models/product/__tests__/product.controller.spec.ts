import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { ProductMock } from '../__mocks__/product.mock';
import { ReturnProductDto } from '../dtos/returnProduct.dto';

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
            findAll: jest.fn().mockResolvedValue([ProductMock]), // Mock do service
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

      expect(result).toEqual(expected);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle errors properly', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new Error());

      await expect(controller.findAll()).rejects.toThrowError();
    });
  });
});
