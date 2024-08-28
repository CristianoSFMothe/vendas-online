import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../cart.service';
import { CartEntity } from '../entities/cart.entity';
import { CartProductService } from '../../../models/cart-product/cart-product.service';
import { cartMock } from '../__mocks__ /cart.mock';
import { updateCartMock } from '../__mocks__ /update-cart.mock';
import { ProductMock } from '../../../models/product/__mocks__/product.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { insertCartMock } from '../__mocks__ /insert-cart.mock';
import { ProductService } from '../../../models/product/product.service';
import { returnDeleteMock } from '../../../__mocks__/returnDelete.mock';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<CartEntity>;
  let cartProductService: CartProductService;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CartProductService,
          useValue: {
            insertProductInCart: jest.fn().mockResolvedValue(undefined),
            deleteProductCart: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProductInCart: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findProductById: jest.fn().mockResolvedValue(ProductMock),
            updateProductAmount: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(cartMock),
            findOne: jest.fn().mockResolvedValue(cartMock),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<CartEntity>>(
      getRepositoryToken(CartEntity),
    );
    cartProductService = module.get<CartProductService>(CartProductService);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartRepository).toBeDefined();
    expect(cartProductService).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('findCartByUserId', () => {
    it('should return cart if found', async () => {
      const cart = await service.findCartByUserId(cartMock.userId);

      expect(cart).toEqual(cartMock);
    });

    it('should throw NotFoundException if cart not found', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findCartByUserId(cartMock.userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createCart', () => {
    it('should create and return a new cart', async () => {
      const cart = await service.createCart(cartMock.userId);

      expect(cart).toEqual(cartMock);
      expect(cartRepository.save).toHaveBeenCalledWith({
        active: true,
        userId: cartMock.userId,
      });
    });
  });

  describe('insertProductInCart', () => {
    it('should insert product in cart if product is available', async () => {
      const expectedAmount = ProductMock.amount - insertCartMock.amount;

      await service.insertProductInCart(insertCartMock, cartMock.userId);

      expect(productService.findProductById).toHaveBeenCalledWith(
        insertCartMock.productId,
      );
      expect(productService.updateProductAmount).toHaveBeenCalledWith(
        ProductMock.id,
        expectedAmount, // Certifique-se de que este valor está correto
      );
      expect(cartProductService.insertProductInCart).toHaveBeenCalledWith(
        insertCartMock,
        cartMock,
      );
    });

    it('should throw BadRequestException if product amount is insufficient', async () => {
      jest
        .spyOn(productService, 'findProductById')
        .mockResolvedValue({ ...ProductMock, amount: 0 });

      await expect(
        service.insertProductInCart(insertCartMock, cartMock.userId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('clearCart', () => {
    it('should deactivate the cart', async () => {
      const result = await service.clearCart(cartMock.userId);

      expect(result).toEqual({ raw: [], affected: 1 });
      expect(cartRepository.save).toHaveBeenCalledWith({
        ...cartMock,
        active: false,
      });
    });
  });

  describe('deleteProductCart', () => {
    it('should delete product from cart', async () => {
      await service.deleteProductCart(ProductMock.id, cartMock.userId);

      expect(cartProductService.deleteProductCart).toHaveBeenCalledWith(
        ProductMock.id,
        cartMock.id,
      );
    });
  });

  describe('updateProductInCart', () => {
    it('should update product in cart', async () => {
      await service.updateProductInCart(updateCartMock, cartMock.userId);

      expect(cartProductService.updateProductInCart).toHaveBeenCalledWith(
        updateCartMock,
        cartMock,
      );
    });
  });
});
